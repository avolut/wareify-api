import { BatchStatus } from "../../batch/entity/batch-entity";
import {
  BatchRepositoryFactory,
  IBatchRepository,
} from "../../batch/repository/batch-repository";
import { TransactionType } from "../../transaction/entity/transaction-entity";
import {
  ITransactionRepository,
  TransactionRepositoryFactory,
} from "../../transaction/repository/transaction-repository";
import { IssueStatus, IssueType } from "../entity/issue-entity";
import {
  IIssueRepository,
  IssueRepositoryFactory,
} from "../repository/issue-repository";

export interface IUpdateToCompleteUseCaseRequest {
  issueId: number;
}

export interface IUpdateToCompleteUseCaseResponse {
  id: number;
  documentNumber: string;
  documentDate: Date;
  referenceNumber: string;
  issueType: IssueType;
  description: string;
  status: IssueStatus;
  createdAt: Date;
  updatedAt: Date;
}

export interface IUpdateToCompleteUseCase {
  execute(
    request: IUpdateToCompleteUseCaseRequest
  ): Promise<IUpdateToCompleteUseCaseResponse>;
}

export class UpdateToCompleteUseCase implements IUpdateToCompleteUseCase {
  constructor(
    private issueRepository: IIssueRepository,
    private batchRepository: IBatchRepository,
    private transactionRepository: ITransactionRepository
  ) {}

  public async execute(
    request: IUpdateToCompleteUseCaseRequest
  ): Promise<IUpdateToCompleteUseCaseResponse> {
    const issueExist = await this.issueRepository.findById(request.issueId);
    if (!issueExist) {
      throw new Error("Issue not found");
    }
    const batches = await this.batchRepository.findBatchIssueByIssueId(
      request.issueId
    );
    if (batches.length == 0) {
      throw new Error("Batch not found");
    }
    batches.forEach(async (batch) => {
      if (batch.status != BatchStatus.FINISHED) {
        throw new Error("Batch status is not finished");
      }
    });
    const existingBatches = await this.batchRepository.findByIds(
      batches.map((batch) => batch.id)
    );
    const groupByBinId = existingBatches.reduce((acc, batch) => {
      if (!acc[batch.binId]) {
        acc[batch.binId] = [];
      }
      acc[batch.binId].push(batch);
      return acc;
    }, {});

    // return groupByBinId;
    try {
      let totalQuantity: number = 0;
      Object.values(groupByBinId).forEach(async (binBatches: any, index) => {
        totalQuantity += binBatches[index].quantity;
        const binCurrentAmount = binBatches[index].bin.current; // check this error
        await this.transactionRepository.createTransaction(
          issueExist.warehouseId,
          parseInt(binBatches[index].binId),
          TransactionType.ISSUE,
          issueExist.id,
          totalQuantity,
          binCurrentAmount
        );
      });
    } catch (error: any) {
      throw new Error(error.message);
    }

    return await this.issueRepository.updateToComplete(request.issueId);
  }
}

export class UpdateToCompleteUseCaseFactory {
  static create(): IUpdateToCompleteUseCase {
    return new UpdateToCompleteUseCase(
      IssueRepositoryFactory.create(),
      BatchRepositoryFactory.create(),
      TransactionRepositoryFactory.create()
    );
  }
}

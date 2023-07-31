import {
  BatchRepositoryFactory,
  IBatchRepository,
} from "../../batch/repository/batch-repository";
import { TransactionType } from "../../transaction/entity/transaction-entity";
import {
  ITransactionRepository,
  TransactionRepositoryFactory,
} from "../../transaction/repository/transaction-repository";
import { ReceiveStatus } from "../entity/receive-entity";
import {
  IReceiveRepository,
  ReceiveRepositoryFactory,
} from "../repository/receive-repository";

export interface IUpdateStatusToCompletedUseCaseRequest {
  receiveId: number;
}

export interface IUpdateStatusToCompletedUseCaseResponse {
  id: number;
  documentNumber: string;
  documentDate: Date;
  referenceNumber: string;
  description: string;
  status: ReceiveStatus;
  createdAt: Date;
  updatedAt: Date;
}

export interface IUpdateStatusToCompletedUseCase {
  execute(
    request: IUpdateStatusToCompletedUseCaseRequest
  ): Promise<IUpdateStatusToCompletedUseCaseResponse>;
}

export class UpdateStatusToCompletedUseCase
  implements IUpdateStatusToCompletedUseCase
{
  constructor(
    private receiveRepository: IReceiveRepository,
    private batchRepository: IBatchRepository,
    private transactionRepository: ITransactionRepository
  ) {}

  async execute(
    request: IUpdateStatusToCompletedUseCaseRequest
  ): Promise<IUpdateStatusToCompletedUseCaseResponse> {
    const receiveExist = await this.receiveRepository.findById(
      request.receiveId
    );

    if (!receiveExist) {
      throw new ReceiveNotFoundError();
    }

    if (receiveExist.status !== ReceiveStatus.TAGGING) {
      throw new Error("Receive status is not TAGGING");
    }
    const batches = await this.batchRepository.findBatchByReceiveId(
      request.receiveId
    );

    const groupByBinId = batches.reduce((acc, batch) => {
      if (!acc[batch.binId]) {
        acc[batch.binId] = [];
      }
      acc[batch.binId].push(batch);
      return acc;
    }, {});

    try {
      Object.keys(groupByBinId).forEach(async (binId) => {
        const binBatches = groupByBinId[binId];
        const totalQuantity = binBatches.reduce(
          (acc, batch) => acc + batch.quantity,
          0
        );
        const binCurrentAmount = binBatches[0].bin.current;
        await this.transactionRepository.createTransaction(
          receiveExist.warehouseId,
          parseInt(binId),
          TransactionType.RECEIVE,
          receiveExist.id,
          totalQuantity,
          binCurrentAmount
        );
      });
    } catch (error: any){
      throw new Error(error.message);
    }

    const receive = await this.receiveRepository.updateStatusToCompleted(
      request.receiveId
    );

    return {
      id: receive.id,
      documentNumber: receive.documentNumber,
      documentDate: receive.documentDate,
      referenceNumber: receive.referenceNumber,
      description: receive.description,
      status: receive.status,
      createdAt: receive.createdAt,
      updatedAt: receive.updatedAt,
    };
  }
}

export class ReceiveNotFoundError extends Error {
  constructor() {
    super("Receive not found");
  }
}

export class UpdateStatusToCompletedUseCaseFactory {
  static create(): IUpdateStatusToCompletedUseCase {
    return new UpdateStatusToCompletedUseCase(
      ReceiveRepositoryFactory.create(),
      BatchRepositoryFactory.create(),
      TransactionRepositoryFactory.create()
    );
  }
}

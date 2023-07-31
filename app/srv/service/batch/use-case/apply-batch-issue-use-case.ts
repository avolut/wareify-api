import { BatchStatus } from "../entity/batch-entity";
import { BatchRepositoryFactory, IBatchRepository } from "../repository/batch-repository";

export interface IApplyBatchIssueUseCaseRequest {
  batchIds: number[];
  issueId: number;
  status: BatchStatus;
}

export interface IApplyBatchIssueUseCaseResponse {
  message: string;
}

export interface IApplyBatchIssueUseCase {
  execute(
    request: IApplyBatchIssueUseCaseRequest
  ): Promise<IApplyBatchIssueUseCaseResponse>;
}

export class ApplyBatchIssueUseCase implements IApplyBatchIssueUseCase {
  constructor(private batchRepository: IBatchRepository) {}

  public async execute(
    request: IApplyBatchIssueUseCaseRequest
  ): Promise<IApplyBatchIssueUseCaseResponse> {
    const batchExist = await this.batchRepository.findByIds(request.batchIds);
    if (!batchExist) {
      throw new Error("Batch not found");
    }
    return await this.batchRepository.updateBatchIssueStatus(
      request.batchIds,
      request.issueId,
      request.status
    );
  }
}

export class ApplyBatchIssueUseCaseFactory {
  static create(): IApplyBatchIssueUseCase {
    return new ApplyBatchIssueUseCase(BatchRepositoryFactory.create());
  }
}
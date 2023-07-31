import { BatchStatus } from "../../batch/entity/batch-entity";
import { BatchRepositoryFactory, IBatchRepository } from "../../batch/repository/batch-repository";
import { IssueStatus, IssueType } from "../entity/issue-entity";
import { IIssueRepository, IssueRepositoryFactory } from "../repository/issue-repository";

export interface IUpdateToInProgressUseCaseRequest {
  issueId: number;
}

export interface IUpdateToInProgressUseCaseResponse {
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

export interface IUpdateToInProgressUseCase {
  execute(
    request: IUpdateToInProgressUseCaseRequest
  ): Promise<IUpdateToInProgressUseCaseResponse>;
}

export class UpdateToInProgressUseCase implements IUpdateToInProgressUseCase {
  constructor(private issueRepository: IIssueRepository, private batchRepository: IBatchRepository) {}

  public async execute(
    request: IUpdateToInProgressUseCaseRequest
  ): Promise<IUpdateToInProgressUseCaseResponse> {
    const issueExist = await this.issueRepository.findById(request.issueId);
    if (!issueExist) {
      throw new Error("Issue not found");
    }
    const batches = await this.batchRepository.findBatchIssueByIssueId(request.issueId);
    if(batches.length == 0){
      throw new Error("Batch not found");
    }
    batches.forEach(async (batch) => {
      if(batch.status != BatchStatus.APPLIED){
        throw new Error("Batch status is not applied");
      }
    });
    return await this.issueRepository.updateToInProgress(request.issueId);
  }
}

export class UpdateToInProgressUseCaseFactory {
  static create(): IUpdateToInProgressUseCase {
    return new UpdateToInProgressUseCase(IssueRepositoryFactory.create(), BatchRepositoryFactory.create());
  }
}
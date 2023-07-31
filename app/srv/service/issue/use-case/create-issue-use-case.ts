import { IssueStatus, IssueType } from "../entity/issue-entity";
import { IIssueRepository, IssueRepositoryFactory } from "../repository/issue-repository";

export interface ICreateIssueUseCaseRequest {
  documentDate: Date;
  warehouseId: number;
  issueType: IssueType;
  userIds?: number[];
  productIds?: number[];
  description?: string;
  referenceNumber?: string;
}

export interface ICreateIssueUseCaseResponse {
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

export interface ICreateIssueUseCase {
  execute(request: ICreateIssueUseCaseRequest): Promise<ICreateIssueUseCaseResponse>;
}

export class CreateIssueUseCase implements ICreateIssueUseCase {
  constructor(private issueRepository: IIssueRepository) {}

  async execute(request: ICreateIssueUseCaseRequest): Promise<ICreateIssueUseCaseResponse> {
    const issue = await this.issueRepository.createIssue(
      request.documentDate,
      request.warehouseId,
      request.issueType,
      request.userIds,
      request.productIds,
      request.description,
      request.referenceNumber
    );

    return {
      id: issue.id,
      documentNumber: issue.documentNumber,
      documentDate: issue.documentDate,
      referenceNumber: issue.referenceNumber,
      issueType: issue.issueType,
      description: issue.description,
      status: issue.status,
      createdAt: issue.createdAt,
      updatedAt: issue.updatedAt,
    };
  }
}

export class CreateIssueUseCaseFactory {
  static create(): ICreateIssueUseCase {
    return new CreateIssueUseCase(IssueRepositoryFactory.create());
  }
}
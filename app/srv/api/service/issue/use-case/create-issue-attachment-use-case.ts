import { ReceiveAttachmentType } from "../../receive/entity/receive-attachment-entity";
import { IIssueRepository, IssueRepositoryFactory } from "../repository/issue-repository";

export interface ICreateIssueAttachmentUseCaseRequest {
  issueId: number;
  name: string;
  path: string;
  type: ReceiveAttachmentType;
}

export interface ICreateIssueAttachmentUseCaseResponse {
  id: number;
  name: string;
  path: string;
  type: ReceiveAttachmentType;
  createdAt: Date;
  updatedAt: Date;
}

export interface ICreateIssueAttachmentUseCase {
  execute(
    request: ICreateIssueAttachmentUseCaseRequest
  ): Promise<ICreateIssueAttachmentUseCaseResponse>;
}

export class CreateIssueAttachmentUseCase implements ICreateIssueAttachmentUseCase {
  constructor(private issueRepository: IIssueRepository) {}

  async execute(
    request: ICreateIssueAttachmentUseCaseRequest
  ): Promise<ICreateIssueAttachmentUseCaseResponse> {
    if(request.type == ReceiveAttachmentType.PHOTO) {
      const count = await this.issueRepository.countIssueAttachmentByType(request.issueId, ReceiveAttachmentType.PHOTO);
      if(count >= 3) {
        throw new Error("Maximum photo attachment is 3");
      }
    } else {
      const count = await this.issueRepository.countIssueAttachmentByType(request.issueId, ReceiveAttachmentType.DOCUMENT);
      if(count >= 1) {
        throw new Error("Maximum document attachment is 1");
      }
    }
    const issueAttachment = await this.issueRepository.createIssueAttachment(
      request.issueId,
      request.name,
      request.path,
      request.type
    );

    return {
      id: issueAttachment.id,
      name: issueAttachment.name,
      path: issueAttachment.path,
      type: issueAttachment.type,
      createdAt: issueAttachment.createdAt,
      updatedAt: issueAttachment.updatedAt,
    };
  }
}

export class CreateIssueAttachmentUseCaseFactory {
  static create(): ICreateIssueAttachmentUseCase {
    return new CreateIssueAttachmentUseCase(IssueRepositoryFactory.create());
  }
}
import { ReceiveAttachmentType } from "../entity/receive-attachment-entity";
import { IReceiveRepository, ReceiveRepositoryFactory } from "../repository/receive-repository";

export interface ICreeateReceiveAttachmentUseCaseRequest {
  receiveId: number;
  name: string;
  path: string;
  type: ReceiveAttachmentType;
}

export interface ICreeateReceiveAttachmentUseCaseResponse {
  id: number;
  name: string;
  path: string;
  type: ReceiveAttachmentType;
  createdAt: Date;
  updatedAt: Date;
}

export interface ICreateReceiveAttachmentUseCase {
  execute(request: ICreeateReceiveAttachmentUseCaseRequest): Promise<ICreeateReceiveAttachmentUseCaseResponse>;
}

export class CreateReceiveAttachmentUseCase implements ICreateReceiveAttachmentUseCase {
  constructor(private receiveRepository: IReceiveRepository) {}

  async execute(request: ICreeateReceiveAttachmentUseCaseRequest): Promise<ICreeateReceiveAttachmentUseCaseResponse> {
    if(request.type == ReceiveAttachmentType.PHOTO) {
      const count = await this.receiveRepository.countReceiveAttachmentByType(request.receiveId, ReceiveAttachmentType.PHOTO);
      if(count >= 3) {
        throw new Error("Maximum photo attachment is 3");
      }
    } else {
      const count = await this.receiveRepository.countReceiveAttachmentByType(request.receiveId, ReceiveAttachmentType.DOCUMENT);
      if(count >= 1) {
        throw new Error("Maximum document attachment is 1");
      }
    }
    const receiveAttachment = await this.receiveRepository.createReceiveAttachment(
      request.receiveId,
      request.name,
      request.path,
      request.type
    );

    return {
      id: receiveAttachment.id,
      name: receiveAttachment.name,
      path: receiveAttachment.path,
      type: receiveAttachment.type,
      createdAt: receiveAttachment.createdAt,
      updatedAt: receiveAttachment.updatedAt,
    };
  }
}

export class CreateReceiveAttachmentUseCaseFactory {
  static create(): ICreateReceiveAttachmentUseCase {
    return new CreateReceiveAttachmentUseCase(ReceiveRepositoryFactory.create());
  }
}
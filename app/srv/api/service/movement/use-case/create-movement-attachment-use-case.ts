import { ReceiveAttachmentType } from "../../receive/entity/receive-attachment-entity";
import { IMovementRepository, MovementRepositoryFactory } from "../repository/movement-repository";

export interface ICreateMovementAttachmentUseCaseRequest {
  movementId: number;
  name: string;
  path: string;
  type: ReceiveAttachmentType;
}

export interface ICreateMovementAttachmentUseCaseResponse {
  id: number;
  name: string;
  path: string;
  type: ReceiveAttachmentType;
  createdAt: Date;
  updatedAt: Date;
}

export interface ICreateMovementAttachmentUseCase {
  execute(
    request: ICreateMovementAttachmentUseCaseRequest
  ): Promise<ICreateMovementAttachmentUseCaseResponse>;
}

export class CreateMovementAttachmentUseCase implements ICreateMovementAttachmentUseCase {
  constructor(private movementRepository: IMovementRepository) {}

  async execute(
    request: ICreateMovementAttachmentUseCaseRequest
  ): Promise<ICreateMovementAttachmentUseCaseResponse> {
    if(request.type == ReceiveAttachmentType.PHOTO) {
      const count = await this.movementRepository.countMovementAttachmentByType(request.movementId, ReceiveAttachmentType.PHOTO);
      if(count >= 3) {
        throw new Error("Maximum photo attachment is 3");
      }
    } else {
      const count = await this.movementRepository.countMovementAttachmentByType(request.movementId, ReceiveAttachmentType.DOCUMENT);
      if(count >= 1) {
        throw new Error("Maximum document attachment is 1");
      }
    }
    const movementAttachment = await this.movementRepository.createMovementAttachment(
      request.movementId,
      request.name,
      request.path,
      request.type
    );

    return {
      id: movementAttachment.id,
      name: movementAttachment.name,
      path: movementAttachment.path,
      type: movementAttachment.type,
      createdAt: movementAttachment.createdAt,
      updatedAt: movementAttachment.updatedAt,
    };
  }
}

export class CreateMovementAttachmentUseCaseFactory {
  static create(): ICreateMovementAttachmentUseCase {
    return new CreateMovementAttachmentUseCase(MovementRepositoryFactory.create());
  }
}
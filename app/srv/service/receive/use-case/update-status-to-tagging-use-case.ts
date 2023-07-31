import { ReceiveStatus } from "../entity/receive-entity";
import {
  IReceiveRepository,
  ReceiveRepositoryFactory,
} from "../repository/receive-repository";

export interface IUpdateStatusToTaggingUseCaseRequest {
  id: number;
}

export interface IUpdateStatusToTaggingUseCaseResponse {
  id: number;
  documentNumber: string;
  documentDate: Date;
  referenceNumber: string;
  description: string;
  status: ReceiveStatus;
  createdAt: Date;
  updatedAt: Date;
}

export interface IUpdateStatusToTaggingUseCase {
  execute(
    request: IUpdateStatusToTaggingUseCaseRequest
  ): Promise<IUpdateStatusToTaggingUseCaseResponse>;
}

export class UpdateStatusToTaggingUseCase
  implements IUpdateStatusToTaggingUseCase
{
  constructor(private readonly receiveRepository: IReceiveRepository) {}

  public async execute(
    request: IUpdateStatusToTaggingUseCaseRequest
  ): Promise<IUpdateStatusToTaggingUseCaseResponse> {
    const receiveExist = await this.receiveRepository.findById(request.id);

    if (!receiveExist) {
      throw new ReceiveNotFoundError();
    }

    if(receiveExist.status !== ReceiveStatus.DRAFT) {
      throw new Error("Receive status is not DRAFT");
    }

    if(!receiveExist.products) {
      throw new Error("Receive products is empty");
    }

    if(!receiveExist.users) {
      throw new Error("Receive users is empty");
    }

    const receive = await this.receiveRepository.updateStatusToTagging(receiveExist.id);

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

export class UpdateStatusToTaggingUseCaseFactory {
  static create(): IUpdateStatusToTaggingUseCase {
    return new UpdateStatusToTaggingUseCase(ReceiveRepositoryFactory.create());
  }
}

import { ReceiveStatus, ReceiveType } from "../entity/receive-entity";
import { IReceiveRepository, ReceiveRepositoryFactory } from "../repository/receive-repository";

export interface ICreateReceiveUseCaseRequest {
  documentDate: Date;
  warehouseId: number;
  receiveType: ReceiveType;
  userIds?: number[];
  productIds?: number[];
  description?: string;
  referenceNumber?: string;
}

export interface ICreateReceiveUseCaseResponse {
  id: number;
  documentNumber: string;
  documentDate: Date;
  referenceNumber: string;
  description: string;
  status: ReceiveStatus;
  createdAt: Date;
  updatedAt: Date;
}

export interface ICreateReceiveUseCase {
  execute(request: ICreateReceiveUseCaseRequest): Promise<ICreateReceiveUseCaseResponse>;
}

export class CreateReceiveUseCase implements ICreateReceiveUseCase {
  constructor(private receiveRepository: IReceiveRepository) {}

  async execute(request: ICreateReceiveUseCaseRequest): Promise<ICreateReceiveUseCaseResponse> {
    const receive = await this.receiveRepository.createReceive(
      request.documentDate,
      request.warehouseId,
      request.receiveType,
      request.userIds,
      request.productIds,
      request.description,
      request.referenceNumber
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

export class CreateReceiveUseCaseFactory {
  static create(): ICreateReceiveUseCase {
    return new CreateReceiveUseCase(ReceiveRepositoryFactory.create());
  }
}
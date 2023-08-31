import { ReceiveStatus, ReceiveType } from "../entity/receive-entity";
import { IReceiveRepository, ReceiveRepositoryFactory } from "../repository/receive-repository";

export interface IGetReceiveByIdUseCaseRequest {
  receiveId: number;
}

export interface IGetReceiveByIdUseCaseResponse {
  documentNumber: string;
  documentDate: Date;
  referenceNumber: string;
  description: string;
  status: ReceiveStatus;
  receiveType: ReceiveType;
  createdAt: Date;
  updatedAt: Date;
  productCount: number;
  totalQuantity: number;
  products: any;
  batches: any;
  users: any;
}

export interface IGetReceiveByIdUseCase {
  execute(
    request: IGetReceiveByIdUseCaseRequest
  ): Promise<IGetReceiveByIdUseCaseResponse>;
}

export class GetReceiveByIdUseCase implements IGetReceiveByIdUseCase {
  constructor(private receiveRepository: IReceiveRepository) {}

  async execute(
    request: IGetReceiveByIdUseCaseRequest
  ): Promise<IGetReceiveByIdUseCaseResponse> {
    const receive = await this.receiveRepository.getReceiveById(
      request.receiveId
    );
    return {
      documentNumber: receive.documentNumber,
      documentDate: receive.documentDate,
      referenceNumber: receive.referenceNumber,
      description: receive.description,
      status: receive.status,
      receiveType: receive.receiveType,
      createdAt: receive.createdAt,
      updatedAt: receive.updatedAt,
      productCount: receive.products!.length,
      totalQuantity: receive.batches!.reduce(
        (acc: number, batch: any) => acc + batch.quantity,
        0
      ),
      products: receive.products,
      batches: receive.batches,
      users: receive.users,
    };
  }
}

export class GetReceiveByIdUseCaseFactory {
  static create() {
    const receiveRepository = ReceiveRepositoryFactory.create();
    return new GetReceiveByIdUseCase(receiveRepository);
  }
}
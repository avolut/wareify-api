import { ReceiveStatus } from "../entity/receive-entity";
import { IReceiveRepository, ReceiveRepositoryFactory } from "../repository/receive-repository";

export interface IGetReceiveByWarehouseIdUseCaseRequest {
  warehouseId: number;
}

export interface IGetReceiveByWarehouseIdUseCaseResponse {
  id: number;
  documentNumber: string;
  documentDate: Date;
  referenceNumber: string;
  description: string;
  status: ReceiveStatus;
  createdAt: Date;
  updatedAt: Date;
  productCount: number;
  totalQuantity: number;
  products: any;
  batches: any;
  users: any;
}

export interface IGetReceiveByWarehouseIdUseCase {
  execute(
    request: IGetReceiveByWarehouseIdUseCaseRequest
  ): Promise<IGetReceiveByWarehouseIdUseCaseResponse[]>;
}

export class GetReceiveByWarehouseIdUseCase
  implements IGetReceiveByWarehouseIdUseCase {
  constructor(private receiveRepository: IReceiveRepository) {}

  async execute(
    request: IGetReceiveByWarehouseIdUseCaseRequest
  ): Promise<IGetReceiveByWarehouseIdUseCaseResponse[]> {
    const receives = await this.receiveRepository.getReceivesByWarehouseId(
      request.warehouseId
    );
    return receives.map((receive) => {
      return {
        id: receive.id,
        documentNumber: receive.documentNumber,
        documentDate: receive.documentDate,
        referenceNumber: receive.referenceNumber,
        description: receive.description,
        status: receive.status,
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
    });
  }
}

export class GetReceiveByWarehouseIdUseCaseFactory {
  static create(): IGetReceiveByWarehouseIdUseCase {
    return new GetReceiveByWarehouseIdUseCase(
      ReceiveRepositoryFactory.create()
    );
  }
}
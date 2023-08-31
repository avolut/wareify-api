import { ReceiveStatus, ReceiveType } from "../entity/receive-entity";
import { IReceiveRepository, ReceiveRepositoryFactory } from "../repository/receive-repository";

export interface IGetReceivesDraftByWarehouseIdUseCaseRequest {
  warehouseId: number;
}

export interface IGetReceivesDraftByWarehouseIdUseCaseResponse {
  id: number;
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

export interface IGetReceivesDraftByWarehouseIdUseCase {
  execute(
    request: IGetReceivesDraftByWarehouseIdUseCaseRequest
  ): Promise<IGetReceivesDraftByWarehouseIdUseCaseResponse[]>;
}

export class GetReceivesDraftByWarehouseIdUseCase
  implements IGetReceivesDraftByWarehouseIdUseCase {
  constructor(private receiveRepository: IReceiveRepository) {}

  async execute(
    request: IGetReceivesDraftByWarehouseIdUseCaseRequest
  ): Promise<IGetReceivesDraftByWarehouseIdUseCaseResponse[]> {
    const receives = await this.receiveRepository.getReceivesDraftByWarehouseId(
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
    });
  }
}

export class GetReceivesDraftByWarehouseIdUseCaseFactory {
  static create() {
    const receiveRepository = ReceiveRepositoryFactory.create();
    return new GetReceivesDraftByWarehouseIdUseCase(receiveRepository);
  }
}
import { BatchRepositoryFactory, IBatchRepository } from "../repository/batch-repository";

export interface IFindByWarehouseAndProductIdUseCaseRequest {
  warehouseId: number;
  productId: number;
}

export interface IFindByWarehouseAndProductIdUseCaseResponse {
  id: number;
  code: string;
  quantity: number;
  status: string;
  warehouseId: number;
  productId: number;
  createdAt: Date;
  updatedAt: Date;
}

export interface IFindByWarehouseAndProductIdUseCase {
  execute(
    request: IFindByWarehouseAndProductIdUseCaseRequest
  ): Promise<IFindByWarehouseAndProductIdUseCaseResponse[]>;
}

export class FindByWarehouseAndProductIdUseCase
  implements IFindByWarehouseAndProductIdUseCase
{
  constructor(private batchRepository: IBatchRepository) {}

  public async execute(
    request: IFindByWarehouseAndProductIdUseCaseRequest
  ): Promise<IFindByWarehouseAndProductIdUseCaseResponse[]> {
    const batches = await this.batchRepository.findByWarehouseAndProductId(
      request.warehouseId,
      request.productId
    );

    return batches.map((batch) => ({
      id: batch.id,
      code: batch.code,
      quantity: batch.quantity,
      status: batch.status,
      warehouseId: batch.warehouseId,
      productId: batch.productId,
      createdAt: batch.createdAt,
      updatedAt: batch.updatedAt,
    }));
  }
}

export class FindByWarehouseAndProductIdUseCaseFactory {
  static create(): IFindByWarehouseAndProductIdUseCase {
    return new FindByWarehouseAndProductIdUseCase(
      BatchRepositoryFactory.create()
    );
  }
}

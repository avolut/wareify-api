import { BatchRepositoryFactory, IBatchRepository } from "../repository/batch-repository";

export interface IUpdateBatchQuantityUseCaseRequest {
  code: string;
  quantity: number;
}

export interface IUpdateBatchQuantityUseCaseResponse {
  id: number;
  receiveId: number;
  productId: number;
  warehouseId: number;
  code: string;
  quantity: number;
  createdAt: Date;
  updatedAt: Date;
}

export interface IUpdateBatchQuantityUseCase {
  execute(request: IUpdateBatchQuantityUseCaseRequest): Promise<IUpdateBatchQuantityUseCaseResponse>;
}

export class UpdateBatchQuantityUseCase implements IUpdateBatchQuantityUseCase {
  constructor(private batchRepository: IBatchRepository) {}

  async execute(request: IUpdateBatchQuantityUseCaseRequest): Promise<IUpdateBatchQuantityUseCaseResponse> {
    const batch = await this.batchRepository.updateBatchQuantity(request.code, request.quantity);

    return {
      id: batch.id,
      receiveId: batch.receiveId,
      productId: batch.productId,
      warehouseId: batch.warehouseId,
      code: batch.code,
      quantity: batch.quantity,
      createdAt: batch.createdAt,
      updatedAt: batch.updatedAt,
    };
  }
}

export class UpdateBatchQuantityUseCaseFactory {
  static create(): IUpdateBatchQuantityUseCase {
    return new UpdateBatchQuantityUseCase(BatchRepositoryFactory.create());
  }
}
import { BatchRepositoryFactory, IBatchRepository } from "../repository/batch-repository";


export interface IGenerateBatchUseCaseRequest {
  receiveId: number;
  productId: number;
  warehouseId: number;
  quantity: number;
}

export interface IGenerateBatchUseCaseResponse {
  id: number;
  receiveId: number;
  productId: number;
  warehouseId: number;
  code: string;
  quantity: number;
  createdAt: Date;
  updatedAt: Date;
}

export interface IGenerateBatchUseCase {
  execute(request: IGenerateBatchUseCaseRequest): Promise<IGenerateBatchUseCaseResponse>;
}

export class GenerateBatchUseCase implements IGenerateBatchUseCase {
  constructor(private batchRepository: IBatchRepository) {}

  async execute(request: IGenerateBatchUseCaseRequest): Promise<IGenerateBatchUseCaseResponse> {
    const batch = await this.batchRepository.generateBatch(
      request.receiveId,
      request.productId,
      request.warehouseId,
      request.quantity
    );

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

export class GenerateBatchUseCaseFactory {
  static create(): IGenerateBatchUseCase {
    return new GenerateBatchUseCase(BatchRepositoryFactory.create());
  }
}
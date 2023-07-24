import { BatchRepositoryFactory, IBatchRepository } from "../repository/batch-repository";

export interface IApplyBatchesUseCaseRequest {
  receiveId: number;
}

export interface IApplyBatchesUseCaseResponse {
  id: number;
  receiveId: number;
  productId: number;
  warehouseId: number;
  code: string;
  quantity: number;
  createdAt: Date;
  updatedAt: Date;
}

export interface IApplyBatchesUseCase {
  execute(request: IApplyBatchesUseCaseRequest): Promise<IApplyBatchesUseCaseResponse[]>;
}

export class ApplyBatchesUseCase implements IApplyBatchesUseCase {
  constructor(private batchRepository: IBatchRepository) {}

  async execute(request: IApplyBatchesUseCaseRequest): Promise<IApplyBatchesUseCaseResponse[]> {
    const batches = await this.batchRepository.applyBatches(request.receiveId);

    return batches;
  }
}

export class ApplyBatchesUseCaseFactory {
  static create(): IApplyBatchesUseCase {
    return new ApplyBatchesUseCase(BatchRepositoryFactory.create());
  }
}
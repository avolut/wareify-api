import { BatchRepositoryFactory, IBatchRepository } from "../repository/batch-repository";

export interface IFindBatchByReceiveIdUseCaseRequest {
  receiveId: number;
}

export interface IFindBatchByReceiveIdUseCaseResponse {
  id: number;
  receiveId: number;
  productId: number;
  warehouseId: number;
  binId: number;
  code: string;
  quantity: number;
  createdAt: Date;
  updatedAt: Date;
  product: any;
  receive: any;
  bin: any;
}

export interface IFindBatchByReceiveIdUseCase {
  execute(request: IFindBatchByReceiveIdUseCaseRequest): Promise<IFindBatchByReceiveIdUseCaseResponse[]>;
}

export class FindBatchByReceiveIdUseCase implements IFindBatchByReceiveIdUseCase {
  constructor(private batchRepository: IBatchRepository) {}

  async execute(request: IFindBatchByReceiveIdUseCaseRequest): Promise<IFindBatchByReceiveIdUseCaseResponse[]> {
    const batches = await this.batchRepository.findBatchByReceiveId(request.receiveId);

    return Promise.all(batches.map((batch) => this.mapToBatchEntity(batch)));
  }

  private async mapToBatchEntity(batch: any): Promise<IFindBatchByReceiveIdUseCaseResponse> {
    return {
      id: batch.id,
      receiveId: batch.receiveId,
      productId: batch.productId,
      warehouseId: batch.warehouseId,
      binId: batch.binId,
      code: batch.code,
      quantity: batch.quantity,
      createdAt: batch.createdAt,
      updatedAt: batch.updatedAt,
      product: batch.product,
      receive: batch.receive,
      bin: batch.bin
    };
  }
}

export class FindBatchByReceiveIdUseCaseFactory {
  static create(): IFindBatchByReceiveIdUseCase {
    return new FindBatchByReceiveIdUseCase(BatchRepositoryFactory.create());
  }
}
import { BatchRepositoryFactory, IBatchRepository } from "../repository/batch-repository";

export interface IGenerateBatchIssueUseCaseRequest {
  batchId: number;
  issueId: number;
  quantity: number;
}

export interface IGenerateBatchIssueUseCaseResponse {
  id: number;
  code: string;
  quantity: number;
  status: string;
  warehouseId: number;
  productId: number;
  createdAt: Date;
  updatedAt: Date;
}

export interface IGenerateBatchIssueUseCase {
  execute(
    request: IGenerateBatchIssueUseCaseRequest
  ): Promise<IGenerateBatchIssueUseCaseResponse>;
}

export class GenerateBatchIssueUseCase implements IGenerateBatchIssueUseCase {
  constructor(private batchRepository: IBatchRepository) {}

  public async execute(
    request: IGenerateBatchIssueUseCaseRequest
  ): Promise<IGenerateBatchIssueUseCaseResponse> {
    const batchExist = await this.batchRepository.findById(request.batchId);
    if (!batchExist) {
      throw new Error("Batch not found");
    }
    if(batchExist.quantity < request.quantity){
      throw new Error("Quantity is not enough");
    }
    const batch = await this.batchRepository.generateBatchIssue(
      request.batchId,
      request.issueId,
      request.quantity
    );

    return {
      id: batch.id,
      code: batch.code,
      quantity: batch.quantity,
      status: batch.status,
      warehouseId: batch.warehouseId,
      productId: batch.productId,
      createdAt: batch.createdAt,
      updatedAt: batch.updatedAt,
    };
  }
}

export class GenerateBatchIssueUseCaseFactory {
  static create(): IGenerateBatchIssueUseCase {
    return new GenerateBatchIssueUseCase(BatchRepositoryFactory.create());
  }
}
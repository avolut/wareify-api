import {
  BatchDataSourceFactory,
  IBatchDataSource,
} from "../data-source/batch-data-source";
import { BatchEntity, BatchStatus } from "../entity/batch-entity";
import { IssueBatchEntity } from "../entity/issue-batch-entity";

export interface IBatchRepository {
  generateBatch(
    receiveId: number,
    productId: number,
    warehouseId: number,
    quantity: number
  ): Promise<BatchEntity>;

  updateBatchQuantity(code: string, quantity: number): Promise<BatchEntity>;
  applyBatches(receiveId: number): Promise<any>;
  findBatchByReceiveId(receiveId: number): Promise<BatchEntity[]>;
  putAwayToBin(batchIds: number[], binId: number, quantity: number): Promise<any>;
  findByIds(Ids: number[]): Promise<BatchEntity[]>;
  findByWarehouseAndProductId(warehouseId: number, productId): Promise<BatchEntity[]>;
  generateBatchIssue(
    batchId: number,
    issueId: number,
    quantity: number
  ): Promise<BatchEntity>;
  findById(id: number): Promise<BatchEntity>;
  updateBatchIssueStatus(batchIds: number[], issueId: number, status: BatchStatus): Promise<any>;
  updateSingleBatchIssueStatus(batchId: number, issueId: number, status: BatchStatus): Promise<any>;
  findBatchIssue(batchId: number, issueId: number): Promise<IssueBatchEntity>;
  findBatchIssueByIssueId(issueId: number): Promise<IssueBatchEntity[]>;
}

export class BatchRepository implements IBatchRepository {
  constructor(private batchDataSource: IBatchDataSource) {}

  async generateBatch(
    receiveId: number,
    productId: number,
    warehouseId: number,
    quantity: number
  ): Promise<BatchEntity> {
    receiveId = parseInt(receiveId.toString());
    productId = parseInt(productId.toString());
    warehouseId = parseInt(warehouseId.toString());
    quantity = parseInt(quantity.toString());
    return this.batchDataSource.insertProductToBatchWithReceiveId(
      receiveId,
      productId,
      warehouseId,
      quantity
    );
  }

  async updateBatchQuantity(
    code: string,
    quantity: number
  ): Promise<BatchEntity> {
    code = code.toString();
    quantity = parseInt(quantity.toString());
    return this.batchDataSource.updateBatchQuantity(code, quantity);
  }

  async applyBatches(receiveId: number): Promise<any> {
    receiveId = parseInt(receiveId.toString());
    return this.batchDataSource.applyBatches(receiveId);
  }

  async findBatchByReceiveId(receiveId: number): Promise<BatchEntity[]> {
    receiveId = parseInt(receiveId.toString());
    return this.batchDataSource.findBatchByReceiveId(receiveId);
  }

  async putAwayToBin(batchIds: number[], binId: number, quantity: number): Promise<any> {
    batchIds = batchIds.map((batchId) => parseInt(batchId.toString()));
    binId = parseInt(binId.toString());
    quantity = parseInt(quantity.toString());
    return this.batchDataSource.putAwayToBin(batchIds, binId, quantity);
  }

  async findByIds(Ids: number[]): Promise<BatchEntity[]> {
    Ids = Ids.map((Id) => parseInt(Id.toString()));
    return this.batchDataSource.findByIds(Ids);
  }

  async findByWarehouseAndProductId(warehouseId: number, productId): Promise<BatchEntity[]> {
    warehouseId = parseInt(warehouseId.toString());
    productId = parseInt(productId.toString());
    return this.batchDataSource.findByWarehouseAndProductId(warehouseId, productId);
  }

  async generateBatchIssue(
    batchId: number,
    issueId: number,
    quantity: number
  ): Promise<BatchEntity> {
    batchId = parseInt(batchId.toString());
    issueId = parseInt(issueId.toString());
    quantity = parseInt(quantity.toString());
    return this.batchDataSource.generateBatchIssue(batchId, issueId, quantity);
  }

  async findById(id: number): Promise<BatchEntity> {
    id = parseInt(id.toString());
    return this.batchDataSource.findById(id);
  }

  async updateBatchIssueStatus(batchIds: number[], issueId: number, status: BatchStatus): Promise<any> {
    batchIds = batchIds.map((batchId) => parseInt(batchId.toString()));
    issueId = parseInt(issueId.toString());
    return this.batchDataSource.updateBatchIssueStatus(batchIds, issueId, status);
  }

  async updateSingleBatchIssueStatus(batchId: number, issueId: number, status: BatchStatus): Promise<any> {
    batchId = parseInt(batchId.toString());
    issueId = parseInt(issueId.toString());
    return this.batchDataSource.updateSingleBatchIssueStatus(batchId, issueId, status);
  }

  async findBatchIssue(batchId: number, issueId: number): Promise<IssueBatchEntity> {
    batchId = parseInt(batchId.toString());
    issueId = parseInt(issueId.toString());
    return this.batchDataSource.findBatchIssue(batchId, issueId);
  }

  async findBatchIssueByIssueId(issueId: number): Promise<IssueBatchEntity[]> {
    issueId = parseInt(issueId.toString());
    return this.batchDataSource.findBatchIssueByIssueId(issueId);
  }
}

export class BatchRepositoryFactory {
  static create(): IBatchRepository {
    return new BatchRepository(BatchDataSourceFactory.create());
  }
}

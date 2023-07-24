import { BatchDataSourceFactory, IBatchDataSource } from "../../batch/data-source/batch-data-source";
import { BatchStatus } from "../../batch/entity/batch-entity";
import { BinDataSourceFactory, IBinDataSource } from "../data-source/bin-data-source";
import { BinEntity } from "../entity/bin-entity";

export interface IBinRepository {
  findBinsByWarehouseId(warehouseId: number): Promise<BinEntity[]>;
  findById(id: number): Promise<BinEntity>;
  takeOutFromBin(binId: number, issueId: number, batchId: number): Promise<any>;
}

export class BinRepository implements IBinRepository {
  constructor(private binDataSource: IBinDataSource, private batchDataSource: IBatchDataSource) {}

  async findBinsByWarehouseId(warehouseId: number): Promise<BinEntity[]> {
    return this.binDataSource.findBinsByWarehouseId(warehouseId);
  }

  async findById(id: number): Promise<BinEntity> {
    id = parseInt(id.toString());
    return this.binDataSource.findById(id);
  }

  async takeOutFromBin(binId: number, issueId: number, batchId: number): Promise<any> {
    binId = parseInt(binId.toString());
    issueId = parseInt(issueId.toString());
    batchId = parseInt(batchId.toString());
    
    const bin = await this.binDataSource.findById(binId);
    if(!bin) {
      throw new Error("Bin not found");
    }

    const batch = await this.batchDataSource.findById(batchId);
    if(!batch) {
      throw new Error("Batch not found");
    }
    const batchIssue = await this.batchDataSource.findBatchIssue(batchId, issueId);
    if(!batchIssue) {
      throw new Error("Batch issue not found");
    }
    if(batchIssue.status != BatchStatus.APPLIED) {
      throw new Error("Batch issue status is not applied");
    }
    if(bin.current < batchIssue.quantity) {
      throw new Error("Bin capacity is not enough");
    }
    if(batch.quantity < batchIssue.quantity) {
      throw new Error("Batch quantity is not enough");
    }

    await this.binDataSource.takeOutFromBin(binId, batch.quantity);
    await this.batchDataSource.updateBatchQuantity(batch.code, batch.quantity - batchIssue.quantity);
    await this.batchDataSource.updateSingleBatchIssueStatus(batchId, issueId, BatchStatus.FINISHED);

    return "Success take out from bin";
  }
}

export class BinRepositoryFactory {
  static create(): IBinRepository {
    return new BinRepository(BinDataSourceFactory.create(), BatchDataSourceFactory.create());
  }
}
import { IReceiveDataSource, ReceiveDataSourceFactory } from "../data-source/receive-data-source";
import { ReceiveEntity, ReceiveType } from "../entity/receive-entity";
import { ReceiveAttachmentEntity, ReceiveAttachmentType } from "../entity/receive-attachment-entity";

export interface IReceiveRepository {
  createReceive(
    documentDate: Date,
    warehouseId: number,
    receiveType: ReceiveType,
    userIds?: number[],
    productIds?: number[],
    description?: string,
    referenceNumber?: string
  ): Promise<ReceiveEntity>;

  createReceiveAttachment(
    receiveId: number,
    name: string,
    path: string,
    type: ReceiveAttachmentType,
  ): Promise<ReceiveAttachmentEntity>

  findById(id: number): Promise<ReceiveEntity>;
  updateStatusToTagging(id: number): Promise<ReceiveEntity>;
  updateStatusToCompleted(id: number): Promise<ReceiveEntity>;
  countReceiveAttachmentByType(receiveId: number, type: ReceiveAttachmentType): Promise<number>;
  getReceivesByWarehouseId(warehouseId: number): Promise<ReceiveEntity[]>;
  countReceiveDraftByWarehouseId(warehouseId: number): Promise<number>;
  getReceivesDraftByWarehouseId(warehouseId: number): Promise<ReceiveEntity[]>;
  getReceiveById(receiveId: number): Promise<ReceiveEntity>;
}


export class ReceiveRepositoryFactory {
  static create(): IReceiveRepository {
    return new ReceiveRepository(ReceiveDataSourceFactory.create());
  }
}

class ReceiveRepository implements IReceiveRepository {
  constructor(private receiveDataSource: IReceiveDataSource) {}

  async createReceive(
    documentDate: Date,
    warehouseId: number,
    receiveType: ReceiveType,
    userIds?: number[],
    productIds?: number[],
    description?: string,
    referenceNumber?: string
  ): Promise<ReceiveEntity> {
    try {
      documentDate = new Date(documentDate);
      warehouseId = parseInt(warehouseId.toString());
      userIds = userIds?.map((userId) => parseInt(userId.toString()));
      productIds = productIds?.map((productId) => parseInt(productId.toString()));
      return this.receiveDataSource.createReceive(
        documentDate,
        warehouseId,
        receiveType,
        userIds as number[],
        productIds as number[],
        description,
        referenceNumber
      );
    } catch (error) {
      console.error(`[ReceiveRepository][createReceive][Error] ${error}`);
      throw error;
    }
  }

  async createReceiveAttachment(
    receiveId: number,
    name: string,
    path: string,
    type: ReceiveAttachmentType,
  ): Promise<ReceiveAttachmentEntity> {
    try {
      receiveId = parseInt(receiveId.toString());
      return this.receiveDataSource.createReceiveAttachment(
        receiveId,
        name,
        path,
        type
      );
    } catch (error) {
      console.error(`[ReceiveRepository][createReceiveAttachment][Error] ${error}`);
      throw error;
    }
  }

  async findById(id: number): Promise<ReceiveEntity> {
    try {
      id = parseInt(id.toString());
      return this.receiveDataSource.findById(id);
    } catch (error) {
      console.error(`[ReceiveRepository][findById][Error] ${error}`);
      throw error;
    }
  }

  async updateStatusToTagging(id: number): Promise<ReceiveEntity> {
    try {
      id = parseInt(id.toString());
      return this.receiveDataSource.updateStatusToTagging(id);
    } catch (error) {
      console.error(`[ReceiveRepository][updateStatusToTagging][Error] ${error}`);
      throw error;
    }
  }

  async updateStatusToCompleted(id: number): Promise<ReceiveEntity> {
    try {
      id = parseInt(id.toString());
      return this.receiveDataSource.updateStatusToCompleted(id);
    } catch (error) {
      console.error(`[ReceiveRepository][updateStatusToCompleted][Error] ${error}`);
      throw error;
    }
  }

  async countReceiveAttachmentByType(receiveId: number, type: ReceiveAttachmentType): Promise<number> {
    try {
      receiveId = parseInt(receiveId.toString());
      return this.receiveDataSource.countReceiveAttachmentByType(receiveId, type);
    } catch (error) {
      console.error(`[ReceiveRepository][countReceiveAttachmentByType][Error] ${error}`);
      throw error;
    }
  }

  async getReceivesByWarehouseId(warehouseId: number): Promise<ReceiveEntity[]> {
    try {
      warehouseId = parseInt(warehouseId.toString());
      return this.receiveDataSource.getReceivesByWarehouseId(warehouseId);
    } catch (error) {
      console.error(`[ReceiveRepository][getReceivesByWarehouseId][Error] ${error}`);
      throw error;
    }
  }

  async countReceiveDraftByWarehouseId(warehouseId: number): Promise<number> {
    try {
      warehouseId = parseInt(warehouseId.toString());
      return this.receiveDataSource.countReceiveDraftByWarehouseId(warehouseId);
    } catch (error) {
      console.error(`[ReceiveRepository][countReceiveDraftByWarehouseId][Error] ${error}`);
      throw error;
    }
  }

  async getReceivesDraftByWarehouseId(warehouseId: number): Promise<ReceiveEntity[]> {
    try {
      warehouseId = parseInt(warehouseId.toString());
      return this.receiveDataSource.getReceivesDraftByWarehouseId(warehouseId);
    } catch (error) {
      console.error(`[ReceiveRepository][getReceivesDraftByWarehouseId][Error] ${error}`);
      throw error;
    }
  }

  async getReceiveById(receiveId: number): Promise<ReceiveEntity> {
    try {
      receiveId = parseInt(receiveId.toString());
      return this.receiveDataSource.getReceiveById(receiveId);
    } catch (error) {
      console.error(`[ReceiveRepository][getReceiveById][Error] ${error}`);
      throw error;
    }
  }
}
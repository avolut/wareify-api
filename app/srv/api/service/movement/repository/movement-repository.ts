import { ReceiveAttachmentType } from "../../receive/entity/receive-attachment-entity";
import { IMovementDataSource, MovementDataSourceFactory } from "../data-source/movement-data-source";
import { MovementAttachmentEntity } from "../entity/movement-attachment-entity";
import { MovementEntity, MovementType } from "../entity/movement-entity";

export interface IMovementRepository {
  createMovement(
    documentDate: Date,
    warehouseId: number,
    movementType: MovementType,
    userIds?: number[],
    productIds?: number[],
    description?: string,
    referenceNumber?: string
  ): Promise<MovementEntity>;
  createMovementAttachment(
    movementId: number,
    name: string,
    path: string,
    type: ReceiveAttachmentType
  ): Promise<MovementAttachmentEntity>;
  countMovementAttachmentByType(movementId: number, type: ReceiveAttachmentType): Promise<number>;
}

export class MovementRepository implements IMovementRepository {
  constructor(private movementDataSource: IMovementDataSource) {}

  async createMovement(
    documentDate: Date,
    warehouseId: number,
    movementType: MovementType,
    userIds?: number[],
    productIds?: number[],
    description?: string,
    referenceNumber?: string
  ): Promise<MovementEntity> {
    try {
      documentDate = new Date(documentDate);
      warehouseId = parseInt(warehouseId.toString());
      userIds = userIds?.map((userId) => parseInt(userId.toString()));
      productIds = productIds?.map((productId) =>
        parseInt(productId.toString())
      );
      return this.movementDataSource.createMovement(
        documentDate,
        warehouseId,
        movementType,
        userIds as number[],
        productIds as number[],
        description,
        referenceNumber
      );
    } catch (error) {
      throw error;
    }
  }

  async createMovementAttachment(
    movementId: number,
    name: string,
    path: string,
    type: ReceiveAttachmentType
  ): Promise<MovementAttachmentEntity> {
    try {
      movementId = parseInt(movementId.toString());
      return this.movementDataSource.createMovementAttachment(
        movementId,
        name,
        path,
        type
      );
    } catch (error) {
      throw error;
    }
  }

  async countMovementAttachmentByType(
    movementId: number,
    type: ReceiveAttachmentType
  ): Promise<number> {
    try {
      movementId = parseInt(movementId.toString());
      return this.movementDataSource.countMovementAttachmentByType(
        movementId,
        type
      );
    } catch (error) {
      throw error;
    }
  }
}

export class MovementRepositoryFactory {
  static create(): IMovementRepository {
    return new MovementRepository(MovementDataSourceFactory.create());
  }
}
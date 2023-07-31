import { BatchEntity } from "../../batch/entity/batch-entity";
import { ProductEntity } from "../../product/entity/product-entity";
import { UserEntity } from "../../user/entity/user-entity";
import { MovementAttachmentEntity } from "./movement-attachment-entity";

export enum MovementType {
  MOVEMENT = 'MOVEMENT',
  OTHERS = 'OTHERS'
}

export enum MovementStatus {
  DRAFT = 'DRAFT',
  IN_PROGRESS = 'IN_PROGRESS',
  COMPLETED = 'COMPLETED'
}

export class MovementEntity {
  constructor(
    readonly id: number,
    readonly warehouseId: number,
    readonly movementType: MovementType,
    readonly documentNumber: string,
    readonly documentDate: Date,
    readonly referenceNumber: string,
    readonly description: string,
    readonly status: MovementStatus,
    readonly createdAt: Date,
    readonly updatedAt: Date,
    readonly products: ProductEntity[],
    readonly users: UserEntity[],
    readonly batches: BatchEntity[],
    readonly attachments: MovementAttachmentEntity[],
  ){}
}
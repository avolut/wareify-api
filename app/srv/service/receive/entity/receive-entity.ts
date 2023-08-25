import { BatchEntity } from "../../batch/entity/batch-entity";
import { ProductEntity } from "../../product/entity/product-entity";
import { UserEntity } from "../../user/entity/user-entity";
import { ReceiveAttachmentEntity } from "./receive-attachment-entity";

export enum ReceiveType {
  PURCHASE_ORDER = "PURCHASE_ORDER",
  PRODUCT_RETURN = "PRODUCT_RETURN",
  TRANSFER = "TRANSFER",
  OTHERS = "OTHERS"
}

export enum ReceiveStatus {
  DRAFT = "DRAFT",
  TAGGING = "TAGGING",
  COMPLETED = "COMPLETED"
}

export class ReceiveEntity {
  constructor(
    readonly id: number,
    readonly warehouseId: number,
    readonly receiveType: ReceiveType,
    readonly documentNumber: string,
    readonly documentDate: Date,
    readonly referenceNumber: string,
    readonly description: string,
    readonly status: ReceiveStatus,
    readonly createdAt: Date,
    readonly updatedAt: Date,
    readonly products?: ProductEntity[],
    readonly users?: UserEntity[],
    readonly batches?: BatchEntity[],
    readonly receiveAttachments?: ReceiveAttachmentEntity[],
  ) {}
}
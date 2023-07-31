import { BinEntity } from "../../bin/entity/bin-entity";
import { ProductEntity } from "../../product/entity/product-entity";
import { ReceiveEntity } from "../../receive/entity/receive-entity";

export enum BatchStatus {
  DRAFT = "DRAFT",
  APPLIED = "APPLIED",
  FINISHED = "FINISHED",
}

export class BatchEntity {
  constructor(
    readonly id: number,
    readonly receiveId: number,
    readonly productId: number,
    readonly warehouseId: number,
    readonly binId: number,
    readonly code: string,
    readonly quantity: number,
    readonly status: BatchStatus,
    readonly createdAt: Date,
    readonly updatedAt: Date,
    readonly product: ProductEntity,
    readonly receive: ReceiveEntity,
    readonly bin: BinEntity
  ) {}
}
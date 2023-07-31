import { BinEntity } from "../../bin/entity/bin-entity";
import { WarehouseEntity } from "../../warehouse/entity/warehouse-entity";

export enum TransactionType {
  'RECEIVE' = 'RECEIVE',
  'ISSUE' = 'ISSUE',
  'MOVEMENT' = 'MOVEMENT',
  'STOCK_OPNAME' = 'STOCK_OPNAME',
}

export class TransactionEntity {
  constructor(
    readonly id : number,
    readonly warehouseId: number,
    readonly binId: number,
    readonly transactionType: TransactionType,
    readonly modelId: number,
    readonly amount: number,
    readonly total: number,
    readonly createdAt: Date,
    readonly updatedAt: Date,
    readonly warehouse: WarehouseEntity,
    readonly bin: BinEntity
  ){}
}
import { WarehouseEntity } from "../../warehouse/entity/warehouse-entity";

export class AreaEntity {
  constructor(
    readonly id: number,
    readonly name: string,
    readonly slug: string,
    readonly description: string,
    readonly code: string,
    readonly createdAt: Date,
    readonly updatedAt: Date,
    readonly warehouse: WarehouseEntity
  ) {}
}
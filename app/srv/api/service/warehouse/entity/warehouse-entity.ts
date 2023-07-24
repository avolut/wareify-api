export enum WarehouseStatus {
  ACTIVE = "ACTIVE",
  INACTIVE = "INACTIVE",
}

export class WarehouseEntity {
  constructor(
    readonly id: number,
    readonly name: string,
    readonly slug: string,
    readonly description: string,
    readonly address: string,
    readonly phone: string,
    readonly email: string,
    readonly photo: string,
    readonly status: WarehouseStatus,
    readonly createdAt: Date,
    readonly updatedAt: Date,
  ){}
}
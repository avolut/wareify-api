import { MovementType } from "../../service/movement/entity/movement-entity";

export type CreateMovementRequest = {
  documentDate: Date;
  warehouseId: number;
  movementType: MovementType;
  userIds: number[];
  productIds: number[];
};

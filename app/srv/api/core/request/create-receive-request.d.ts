import { ReceiveType } from "../../service/receive/entity/receive-entity";

export type CreateReceiveRequest = {
  documentDate: Date;
  warehouseId: number;
  receiveType: ReceiveType;
  userIds?: number[];
  productIds?: number[];
  description?: string;
  referenceNumber?: string;
}
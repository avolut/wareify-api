export type CreateReceiveRequest = {
  documentDate: String;
  warehouseId: number;
  receiveType: String;
  userIds?: number[];
  productIds?: number[];
  description?: string;
  referenceNumber?: string;
}
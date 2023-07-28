import { BatchStatus } from "./batch-entity";

export class MovementBatchEntity {
  constructor(
    readonly id: number,
    readonly batchId: number,
    readonly issueId: number,
    readonly quantity: number,
    readonly status: BatchStatus,
    readonly createdAt: Date,
    readonly updatedAt: Date
  ){}
}
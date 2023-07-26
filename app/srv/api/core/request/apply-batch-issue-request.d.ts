import { BatchStatus } from "../../service/batch/entity/batch-entity";

export type ApplyBatchIssueRequest = {
  batchIds: number[];
  status: BatchStatus;
}
import { BatchEntity } from "../../batch/entity/batch-entity";
import { ProductEntity } from "../../product/entity/product-entity";
import { UserEntity } from "../../user/entity/user-entity";
import { IssueAttachmentEntity } from "./issue-attachment-entity";

export enum IssueType {
  MAINTENANCE_ORDER = 'MAINTENANCE_ORDER',
  WORK_ORDER = 'WORK_ORDER',
  OTHERS = 'OTHERS'
}

export enum IssueStatus {
  DRAFT = 'DRAFT',
  IN_PROGRESS = 'IN_PROGRESS',
  COMPLETED = 'COMPLETED'
}

export class IssueEntity {
  constructor(
    readonly id: number,
    readonly warehouseId: number,
    readonly issueType: IssueType,
    readonly documentNumber: string,
    readonly documentDate: Date,
    readonly referenceNumber: string,
    readonly description: string,
    readonly status: IssueStatus,
    readonly createdAt: Date,
    readonly updatedAt: Date,
    readonly products: ProductEntity[],
    readonly users: UserEntity[],
    readonly batches: BatchEntity[],
    readonly attachments: IssueAttachmentEntity[],
  ){}
}
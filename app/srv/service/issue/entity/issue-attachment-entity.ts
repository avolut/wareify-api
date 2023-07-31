import { ReceiveAttachmentType } from "../../receive/entity/receive-attachment-entity";
import { IssueEntity } from "./issue-entity";

export class IssueAttachmentEntity {
  constructor(
    readonly id: number,
    readonly name: string,
    readonly path: string,
    readonly type: ReceiveAttachmentType,
    readonly createdAt: Date,
    readonly updatedAt: Date,
    readonly issue: IssueEntity
  ) {}
}
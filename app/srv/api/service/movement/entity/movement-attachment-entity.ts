import { ReceiveAttachmentType } from "../../receive/entity/receive-attachment-entity";
import { MovementEntity } from "./movement-entity";

export class MovementAttachmentEntity {
  constructor(
    readonly id: number,
    readonly name: string,
    readonly path: string,
    readonly type: ReceiveAttachmentType,
    readonly createdAt: Date,
    readonly updatedAt: Date,
    readonly movement: MovementEntity
  ) {}
}
import { ReceiveEntity } from "./receive-entity"

export enum ReceiveAttachmentType {
  PHOTO = "PHOTO",
  DOCUMENT = "DOCUMENT",
}

export class ReceiveAttachmentEntity {
  constructor(
    readonly id: number,
    readonly name: string,
    readonly path: string,
    readonly type: ReceiveAttachmentType,
    readonly createdAt: Date,
    readonly updatedAt: Date,
    readonly receive: ReceiveEntity
  ){}
}
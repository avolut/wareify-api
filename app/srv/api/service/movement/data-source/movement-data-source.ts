import { PrismaClient } from "../../../../../../app/db/node_modules/.gen";
import { global } from "../../../../global";
import dayjs from "dayjs";
import { MovementEntity, MovementType } from "../entity/movement-entity";
import { MovementAttachmentEntity } from "../entity/movement-attachment-entity";
import { ReceiveAttachmentType } from "../../receive/entity/receive-attachment-entity";

export interface IMovementDataSource {
  createMovement(
    documentDate: Date,
    warehouseId: number,
    movementType: MovementType,
    userIds: number[],
    productIds: number[],
    description?: string,
    referenceNumber?: string
  ): Promise<MovementEntity>;
  createMovementAttachment(
    movementId: number,
    name: string,
    path: string,
    type: ReceiveAttachmentType
  ): Promise<MovementAttachmentEntity>;
  countMovementAttachmentByType(
    movementId: number,
    type: ReceiveAttachmentType
  ): Promise<number>;
}

export class MovementDataSourceFactory {
  static create(): IMovementDataSource {
    return new MovementDataSource(
      new PrismaClient(),
      dayjs().add(parseInt(global.UTC_TIMEZONE.toString()), "hour").toDate()
    );
  }
}

export class MovementDataSource implements IMovementDataSource {
  private timestamps: object;
  constructor(private prisma: PrismaClient, private now: Date) {
    this.timestamps = {
      createdAt: this.now,
      updatedAt: this.now,
    };
  }

  private async generateDocumentNumber(): Promise<string> {
    let code = "";
    let count = 1;
    while (code === "") {
      const nextCode = `MOV${count.toString().padStart(9, "0")}`;
      const existingMovement = await this.prisma.movement.findUnique({
        where: { documentNumber: nextCode },
      });

      if (!existingMovement) {
        code = nextCode;
      } else {
        count++;
      }
    }
    return code;
  }

  async createMovement(
    documentDate: Date,
    warehouseId: number,
    movementType: MovementType,
    userIds: number[],
    productIds: number[],
    description?: string,
    referenceNumber?: string
  ): Promise<MovementEntity> {
    const documentNumber = await this.generateDocumentNumber();
    const movement = await this.prisma.movement.create({
      data: {
        documentNumber,
        documentDate,
        warehouseId,
        movementType,
        description,
        referenceNumber,
        status: "DRAFT",
        ...this.timestamps,
      },
    });

    if(userIds) {
      await this.prisma.movementUser.createMany({
        data: userIds.map((userId) => ({
          userId,
          movementId: movement.id,
          ...this.timestamps,
        })),
      });
    }

    if(productIds) {
      await this.prisma.movementProduct.createMany({
        data: productIds.map((productId) => ({
          productId,
          movementId: movement.id,
          ...this.timestamps,
        })),
      });
    }

    return this.mapToMovementEntity(movement);
  }

  async createMovementAttachment(
    movementId: number,
    name: string,
    path: string,
    type: ReceiveAttachmentType
  ): Promise<MovementAttachmentEntity> {
    const attachment = await this.prisma.movementAttachment.create({
      data: {
        name,
        path,
        type,
        movement: {
          connect: { id: movementId },
        },
        ...this.timestamps,
      },
      include: {
        movement: true,
      },
    });

    return this.mapToMovementAttachmentEntity(attachment);
  }

  async countMovementAttachmentByType(
    movementId: number,
    type: ReceiveAttachmentType
  ): Promise<number> {
    return await this.prisma.movementAttachment.count({
      where: {
        movementId,
        type,
      },
    });
  }

  private async mapToMovementEntity(movement: any): Promise<MovementEntity> {
    return new MovementEntity(
      movement.id,
      movement.warehouseId,
      movement.movementType,
      movement.documentNumber,
      movement.documentDate,
      movement.referenceNumber,
      movement.description,
      movement.status,
      movement.createdAt,
      movement.updatedAt,
      movement.products,
      movement.users,
      movement.batches,
      movement.attachments
    );
  }

  private async mapToMovementAttachmentEntity(
    attachment: any
  ): Promise<MovementAttachmentEntity> {
    return new MovementAttachmentEntity(
      attachment.id,
      attachment.name,
      attachment.path,
      attachment.type,
      attachment.createdAt,
      attachment.updatedAt,
      attachment.movement
    );
  }
}
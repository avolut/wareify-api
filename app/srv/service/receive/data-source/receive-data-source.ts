// import { PrismaClient } from "../../../../../app/db/node_modules/.gen";
import { ReceiveEntity, ReceiveType } from "../entity/receive-entity";
import dayjs from "dayjs";
import {
  ReceiveAttachmentEntity,
  ReceiveAttachmentType,
} from "../entity/receive-attachment-entity";
import { global } from "../../../global";

export interface IReceiveDataSource {
  createReceive(
    documentDate: Date,
    warehouseId: number,
    receiveType: ReceiveType,
    userIds: number[],
    productIds: number[],
    description?: string,
    referenceNumber?: string
  ): Promise<ReceiveEntity>;
  createReceiveAttachment(
    receiveId: number,
    name: string,
    path: string,
    type: ReceiveAttachmentType
  ): Promise<ReceiveAttachmentEntity>;
  findById(id: number): Promise<ReceiveEntity>;
  updateStatusToTagging(receiveId: number): Promise<ReceiveEntity>;
  updateStatusToCompleted(receiveId: number): Promise<ReceiveEntity>;
  countReceiveAttachmentByType(receiveId: number, type: ReceiveAttachmentType): Promise<number>;
  getReceivesByWarehouseId(warehouseId: number): Promise<ReceiveEntity[]>;
  countReceiveDraftByWarehouseId(warehouseId: number): Promise<number>;
  getReceivesDraftByWarehouseId(warehouseId: number): Promise<ReceiveEntity[]>;
}

export class ReceiveDataSourceFactory {
  static create(): IReceiveDataSource {
    return new ReceiveDataSource(
      db,
      dayjs().add(parseInt(global.UTC_TIMEZONE.toString()), "hour").toDate()
    );
  }
}

export class ReceiveDataSource implements IReceiveDataSource {
  private timestamps: object;
  constructor(private prisma: any, private now: Date) {
    this.timestamps = {
      createdAt: this.now,
      updatedAt: this.now,
    };
  }

  private async generateDocumentNumber(): Promise<string> {
    let code = "";
    let count = 1;
    while (code === "") {
      const nextCode = `RCV${count.toString().padStart(9, "0")}`;
      const existingReceive = await this.prisma.receive.findUnique({
        where: { documentNumber: nextCode },
      });

      if (!existingReceive) {
        code = nextCode;
      } else {
        count++;
      }
    }

    return code;
  }

  public async createReceive(
    documentDate: Date,
    warehouseId: number,
    receiveType: ReceiveType,
    userIds?: number[],
    productIds?: number[],
    description?: string,
    referenceNumber?: string
  ): Promise<ReceiveEntity> {
    const receive = await this.prisma.receive.create({
      data: {
        documentDate,
        warehouseId,
        receiveType,
        description,
        documentNumber: await this.generateDocumentNumber(),
        referenceNumber,
        status: "DRAFT",
        ...this.timestamps,
      },
    });

    if (userIds) {
      await this.prisma.receiveUser.createMany({
        data: userIds.map((userId) => ({
          userId,
          receiveId: receive.id,
          ...this.timestamps,
        })),
      });
    }

    if (productIds) {
      await this.prisma.receiveProduct.createMany({
        data: productIds.map((productId) => ({
          productId,
          receiveId: receive.id,
          ...this.timestamps,
        })),
      });
    }

    return this.mapToReceiveEntity(receive);
  }

  public async createReceiveAttachment(
    receiveId: number,
    name: string,
    path: string,
    type: ReceiveAttachmentType
  ): Promise<ReceiveAttachmentEntity> {
    const receiveAttachment = await this.prisma.receiveAttachment.create({
      data: {
        receiveId,
        name,
        path,
        type,
        ...this.timestamps,
      },
    });

    return this.mapToReceiveAttachmentEntity(receiveAttachment);
  }

  public async findById(id: number): Promise<ReceiveEntity> {
    const receive = await this.prisma.receive.findUnique({
      where: { id },
      include: {
        products: {
          include: {
            product: true,
          },
        },
        users: {
          include: {
            user: true,
          },
        },
      },
    });
    return this.mapToReceiveUserProductEntity(
      receive,
      receive?.products.map((product: any) => product.product),
      receive?.users.map((user: any) => user.user)
    );
  }

  public async updateStatusToTagging(
    receiveId: number
  ): Promise<ReceiveEntity> {
    const receive = await this.prisma.receive.update({
      where: { id: receiveId },
      data: {
        status: "TAGGING",
        updatedAt: this.now,
      },
    });

    return this.mapToReceiveEntity(receive);
  }

  public async updateStatusToCompleted(
    receiveId: number
  ): Promise<ReceiveEntity> {
    const receive = await this.prisma.receive.update({
      where: { id: receiveId },
      data: {
        status: "COMPLETED",
        updatedAt: this.now,
      },
    });

    return this.mapToReceiveEntity(receive);
  }

  public async countReceiveAttachmentByType(
    receiveId: number,
    type: ReceiveAttachmentType
  ): Promise<number> {
    return await this.prisma.receiveAttachment.count({
      where: {
        receiveId,
        type,
      },
    });
  }

  public async getReceivesByWarehouseId(
    warehouseId: number
  ): Promise<ReceiveEntity[]> {
    const receives = await this.prisma.receive.findMany({
      where: {
        warehouseId,
        NOT: {
          status: "DRAFT",
        }
      },
      include: {
        products: {
          include: {
            product: true,
          },
        },
        Batch: true,
        users: {
          include: {
            user: true,
          },
        },
      },
    });

    return Promise.all(
      receives.map(async (receive: any) => {
        return this.mapToReceiveUserProductEntity(
          receive,
          receive?.products.map((product: any) => product.product),
          receive?.users.map((user: any) => user.user),
          receive?.Batch
        );
      })
    );
  }

  public async countReceiveDraftByWarehouseId(
    warehouseId: number
  ): Promise<number> {
    return await this.prisma.receive.count({
      where: {
        warehouseId,
        status: "DRAFT",
      },
    });
  }

  public async getReceivesDraftByWarehouseId(
    warehouseId: number
  ): Promise<ReceiveEntity[]> {
    const receives = await this.prisma.receive.findMany({
      where: {
        warehouseId,
        status: "DRAFT",
      },
      include: {
        products: {
          include: {
            product: true,
          },
        },
        Batch: true,
        users: {
          include: {
            user: true,
          },
        },
      },
    });

    return Promise.all(
      receives.map(async (receive: any) => {
        return this.mapToReceiveUserProductEntity(
          receive,
          receive?.products.map((product: any) => product.product),
          receive?.users.map((user: any) => user.user),
          receive?.Batch
        );
      })
    );
  }


  private async mapToReceiveEntity(receive: any): Promise<ReceiveEntity> {
    return new ReceiveEntity(
      receive.id,
      receive.warehouseId,
      receive.receiveType,
      receive.documentNumber,
      receive.documentDate,
      receive.referenceNumber,
      receive.description,
      receive.status,
      receive.createdAt,
      receive.updatedAt
    );
  }

  private async mapToReceiveAttachmentEntity(
    receiveAttachment: any
  ): Promise<ReceiveAttachmentEntity> {
    return new ReceiveAttachmentEntity(
      receiveAttachment.id,
      receiveAttachment.name,
      receiveAttachment.path,
      receiveAttachment.type,
      receiveAttachment.createdAt,
      receiveAttachment.updatedAt,
      receiveAttachment.receiveId
    );
  }

  private async mapToReceiveUserProductEntity(
    receive: any,
    products: any,
    users: any,
    batches?: any
  ): Promise<ReceiveEntity> {
    return new ReceiveEntity(
      receive.id,
      receive.warehouseId,
      receive.receiveType,
      receive.documentNumber,
      receive.documentDate,
      receive.referenceNumber,
      receive.description,
      receive.status,
      receive.createdAt,
      receive.updatedAt,
      products,
      users,
      batches
    );
  }
}

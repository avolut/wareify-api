import { PrismaClient } from "../../../../../../app/db/node_modules/.gen";
import { BatchEntity, BatchStatus } from "../entity/batch-entity";
import dayjs from "dayjs";
import { IssueBatchEntity } from "../entity/issue-batch-entity";
import { global } from "../../../../global";

export interface IBatchDataSource {
  insertProductToBatchWithReceiveId(
    receiveId: number,
    productId: number,
    warehouseId: number,
    quantity: number
  ): Promise<BatchEntity>;
  updateBatchQuantity(code: string, quantity: number): Promise<BatchEntity>;
  applyBatches(receiveId: number): Promise<any>;
  findBatchByReceiveId(receiveId: number): Promise<BatchEntity[]>;
  putAwayToBin(
    batchIds: number[],
    binId: number,
    quantity: number
  ): Promise<any>;
  findByIds(Ids: number[]): Promise<BatchEntity[]>;
  findByWarehouseAndProductId(
    warehouseId: number,
    productId
  ): Promise<BatchEntity[]>;
  generateBatchIssue(
    batchId: number,
    issueId: number,
    quantity: number
  ): Promise<BatchEntity>;
  findById(id: number): Promise<BatchEntity>;
  updateBatchIssueStatus(
    batchIds: number[],
    issueId: number,
    status: BatchStatus
  ): Promise<any>;
  updateSingleBatchIssueStatus(
    batchId: number,
    issueId: number,
    status: BatchStatus
  ): Promise<any>;
  findBatchIssue(batchId: number, issueId: number): Promise<IssueBatchEntity>;
  findBatchIssueByIssueId(issueId: number): Promise<IssueBatchEntity[]>;
}

export class BatchDataSource implements IBatchDataSource {
  private timestamps: object;
  constructor(private prisma: PrismaClient, private now: Date) {
    this.timestamps = {
      createdAt: this.now,
      updatedAt: this.now,
    };
  }

  private async generateCode(): Promise<string> {
    let code = "";
    let count = 1;
    while (code === "") {
      const nextCode = `BAT${count.toString().padStart(9, "0")}`;
      const existingReceive = await this.prisma.batch.findUnique({
        where: { code: nextCode },
      });

      if (!existingReceive) {
        code = nextCode;
      } else {
        count++;
      }
    }

    return code;
  }

  public async insertProductToBatchWithReceiveId(
    receiveId: number,
    productId: number,
    warehouseId: number,
    quantity: number
  ): Promise<BatchEntity> {
    const batch = await this.prisma.batch.create({
      data: {
        code: await this.generateCode(),
        quantity: quantity,
        status: "DRAFT",
        warehouse: {
          connect: {
            id: warehouseId,
          },
        },
        receive: {
          connect: {
            id: receiveId,
          },
        },
        product: {
          connect: {
            id: productId,
          },
        },
        ...this.timestamps,
      },
    });

    return this.mapToBatchEntity(batch);
  }

  public async updateBatchQuantity(
    code: string,
    quantity: number
  ): Promise<BatchEntity> {
    const batch = await this.prisma.batch.update({
      where: { code: code },
      data: {
        quantity: quantity,
        updatedAt: this.now,
      },
    });

    return this.mapToBatchEntity(batch);
  }

  public async applyBatches(receiveId: number): Promise<any> {
    await this.prisma.batch.updateMany({
      where: {
        receiveId: receiveId,
        status: "DRAFT",
      },
      data: {
        status: "APPLIED",
        updatedAt: this.now,
      },
    });

    return "Success apply batch";
  }

  public async findByIds(Ids: number[]): Promise<BatchEntity[]> {
    const batches = await this.prisma.batch.findMany({
      where: {
        id: {
          in: Ids,
        },
      },
      include: {
        product: true,
        receive: true,
      },
    });

    return Promise.all(batches.map((batch) => this.mapToBatchEntity(batch)));
  }

  public async findBatchByReceiveId(receiveId: number): Promise<BatchEntity[]> {
    const batches = await this.prisma.batch.findMany({
      where: {
        receiveId: receiveId,
      },
      include: {
        product: true,
        receive: true,
        bin: true,
      },
    });

    return Promise.all(batches.map((batch) => this.mapToBatchEntity(batch)));
  }

  public async putAwayToBin(
    batchIds: number[],
    binId: number,
    quantity: number
  ): Promise<any> {
    await this.prisma.batch.updateMany({
      where: {
        id: {
          in: batchIds,
        },
      },
      data: {
        status: BatchStatus.FINISHED,
        binId: binId,
        updatedAt: this.now,
      },
    });

    await this.prisma.bin.update({
      where: {
        id: binId,
      },
      data: {
        current: +quantity,
        updatedAt: this.now,
      },
    });

    return "Success put away to bin";
  }

  public async findByWarehouseAndProductId(
    warehouseId: number,
    productId: number
  ): Promise<BatchEntity[]> {
    const batches = await this.prisma.batch.findMany({
      where: {
        warehouseId: warehouseId,
        productId: productId,
      },
      include: {
        product: true,
        receive: true,
        bin: true,
      },
    });

    return Promise.all(batches.map((batch) => this.mapToBatchEntity(batch)));
  }

  public async generateBatchIssue(
    batchId: number,
    issueId: number,
    quantity: number
  ): Promise<BatchEntity> {
    const batch = await this.prisma.batch.update({
      where: { id: batchId },
      data: {
        IssueBatch: {
          create: {
            issueId: issueId,
            quantity: quantity,
            ...this.timestamps,
          },
        },
        quantity: quantity,
        updatedAt: this.now,
      },
    });

    return this.mapToBatchEntity(batch);
  }

  public async findById(id: number): Promise<BatchEntity> {
    const batch = await this.prisma.batch.findUnique({
      where: { id: id },
      include: {
        product: true,
        receive: true,
        bin: true,
      },
    });

    return this.mapToBatchEntity(batch);
  }

  public async updateBatchIssueStatus(
    batchIds: number[],
    issueId: number,
    status: BatchStatus
  ): Promise<any> {
    await this.prisma.issueBatch.updateMany({
      where: {
        batchId: {
          in: batchIds,
        },
        issueId: issueId,
      },
      data: {
        status: status,
        updatedAt: this.now,
      },
    });

    return "Success update batch issue status";
  }

  public async updateSingleBatchIssueStatus(
    batchId: number,
    issueId: number,
    status: BatchStatus
  ): Promise<any> {
    await this.prisma.issueBatch.updateMany({
      where: {
        batchId: batchId,
        issueId: issueId,
      },
      data: {
        status: status,
        updatedAt: this.now,
      },
    });

    return "Success update batch issue status";
  }

  public async findBatchIssue(
    batchId: number,
    issueId: number
  ): Promise<IssueBatchEntity> {
    const issueBatch = await this.prisma.issueBatch.findFirst({
      where: {
        batchId: batchId,
        issueId: issueId,
      },
    });

    return new IssueBatchEntity(
      issueBatch!.id,
      issueBatch!.issueId,
      issueBatch!.batchId,
      issueBatch!.quantity,
      issueBatch!.status as BatchStatus,
      issueBatch!.createdAt,
      issueBatch!.updatedAt
    );
  }

  public async findBatchIssueByIssueId(
    issueId: number
  ): Promise<IssueBatchEntity[]> {
    const issueBatches = await this.prisma.issueBatch.findMany({
      where: {
        issueId: issueId,
      },
    });

    return Promise.all(
      issueBatches.map(
        (issueBatch) =>
          new IssueBatchEntity(
            issueBatch.id,
            issueBatch.issueId,
            issueBatch.batchId,
            issueBatch.quantity,
            issueBatch.status as BatchStatus,
            issueBatch.createdAt,
            issueBatch.updatedAt
          )
      )
    );
  }

  private async mapToBatchEntity(batch: any): Promise<BatchEntity> {
    return new BatchEntity(
      batch.id,
      batch.receiveId,
      batch.productId,
      batch.warehouseId,
      batch.binId,
      batch.code,
      batch.quantity,
      batch.status,
      batch.createdAt,
      batch.updatedAt,
      batch.product,
      batch.receive,
      batch.bin
    );
  }
}

export class BatchDataSourceFactory {
  static create(): IBatchDataSource {
    return new BatchDataSource(
      new PrismaClient(),
      dayjs().add(parseInt(global.UTC_TIMEZONE.toString()), "hour").toDate()
    );
  }
}

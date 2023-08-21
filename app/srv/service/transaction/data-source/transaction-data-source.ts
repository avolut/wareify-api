// import { PrismaClient } from "../../../../../app/db/node_modules/.gen";
import { global } from "../../../global";
import { TransactionEntity, TransactionType } from "../entity/transaction-entity";
import dayjs from "dayjs";

export interface ITransactionDataSource {
  createTransaction(
    warehouseId: number,
    binId: number,
    transactionType: TransactionType,
    modelId: number,
    amount: number,
    total: number
  ): Promise<TransactionEntity>;
}

export class TransactionDataSource implements ITransactionDataSource {
  private timestamps: object;
  constructor(private prisma: any, private now: Date) {
    this.timestamps = {
      createdAt: this.now,
      updatedAt: this.now,
    };
  }

  async createTransaction(
    warehouseId: number,
    binId: number,
    transactionType: TransactionType,
    modelId: number,
    amount: number,
    total: number
  ): Promise<TransactionEntity> {
    const transaction = await this.prisma.transaction.create({
      data: {
        warehouseId,
        binId,
        transactionType,
        modelId,
        amount,
        total,
        ...this.timestamps,
      },
      include: {
        warehouse: true,
        bin: true,
      },
    });

    return this.mapToTransactionEntity(transaction);
  }

  private async mapToTransactionEntity(transaction: any): Promise<TransactionEntity> {
    return new TransactionEntity(
      transaction.id,
      transaction.warehouseId,
      transaction.binId,
      transaction.transactionType,
      transaction.modelId,
      transaction.amount,
      transaction.total,
      transaction.createdAt,
      transaction.updatedAt,
      transaction.warehouse,
      transaction.bin
    );
  }
}

export class TransactionDataSourceFactory {
  public static create(): ITransactionDataSource {
    return new TransactionDataSource(db, dayjs().add(parseInt(global.UTC_TIMEZONE.toString()), "hour").toDate());
  }
}

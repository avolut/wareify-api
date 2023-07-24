import { ITransactionDataSource, TransactionDataSourceFactory } from "../data-source/transaction-data-source";
import { TransactionEntity, TransactionType } from "../entity/transaction-entity";

export interface ITransactionRepository {
  createTransaction(
    warehouseId: number,
    binId: number,
    transactionType: TransactionType,
    modelId: number,
    amount: number,
    total: number
  ): Promise<TransactionEntity>;
}

export class TransactionRepository implements ITransactionRepository {
  constructor(private transactionDataSource: ITransactionDataSource) {}

  async createTransaction(
    warehouseId: number,
    binId: number,
    transactionType: TransactionType,
    modelId: number,
    amount: number,
    total: number
  ): Promise<TransactionEntity> {
    try {
      warehouseId = parseInt(warehouseId.toString());
      binId = parseInt(binId.toString());
      modelId = parseInt(modelId.toString());
      amount = parseInt(amount.toString());
      total = parseInt(total.toString());
      return this.transactionDataSource.createTransaction(
        warehouseId,
        binId,
        transactionType,
        modelId,
        amount,
        total
      );
    } catch (error) {
      throw error;
    }
  }
}

export class TransactionRepositoryFactory {
  static create(): ITransactionRepository {
    return new TransactionRepository(TransactionDataSourceFactory.create());
  }
}
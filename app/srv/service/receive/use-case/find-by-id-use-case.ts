import { ReceiveStatus } from "../entity/receive-entity";
import { IReceiveRepository, ReceiveRepositoryFactory } from "../repository/receive-repository";

export interface IFindByIdUseCaseRequest {
  id: number;
}

export interface IFindByIdUseCaseResponse {
  id: number;
  documentNumber: string;
  documentDate: Date;
  referenceNumber: string;
  description: string;
  status: ReceiveStatus;
  createdAt: Date;
  updatedAt: Date;
  products: any;
  users: any;
}

export interface IFindByIdUseCase {
  execute(
    request: IFindByIdUseCaseRequest
  ): Promise<IFindByIdUseCaseResponse>;
}

export class FindByIdUseCase
  implements IFindByIdUseCase
{
  constructor(private readonly receiveRepository: IReceiveRepository) {}

  public async execute(
    request: IFindByIdUseCaseRequest
  ): Promise<IFindByIdUseCaseResponse> {
    const receive = await this.receiveRepository.findById(request.id);

    if (!receive) {
      throw new ReceiveNotFoundError();
    }

    return {
      id: receive.id,
      documentNumber: receive.documentNumber,
      documentDate: receive.documentDate,
      referenceNumber: receive.referenceNumber,
      description: receive.description,
      status: receive.status,
      createdAt: receive.createdAt,
      updatedAt: receive.updatedAt,
      products: receive.products,
      users: receive.users,
    };
  }
}

export class FindByIdUseCaseFactory {
  static create(): IFindByIdUseCase {
    return new FindByIdUseCase(ReceiveRepositoryFactory.create());
  }
}

export class ReceiveNotFoundError extends Error {
  constructor() {
    super("Receive not found");
  }
}
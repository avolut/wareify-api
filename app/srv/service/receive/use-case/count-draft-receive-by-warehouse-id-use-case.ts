import { IReceiveRepository, ReceiveRepositoryFactory } from "../repository/receive-repository";

export interface ICountDraftReceiveByWarehouseIdRequest {
  warehouseId: number;
}

export interface ICountDraftReceiveByWarehouseIdResponse {
  count: number;
}

export interface ICountDraftReceiveByWarehouseIdUseCase {
  execute(
    request: ICountDraftReceiveByWarehouseIdRequest
  ): Promise<ICountDraftReceiveByWarehouseIdResponse>;
}

export class CountDraftReceiveByWarehouseIdUseCase
  implements ICountDraftReceiveByWarehouseIdUseCase {
  constructor(private receiveRepository: IReceiveRepository) {}

  async execute(
    request: ICountDraftReceiveByWarehouseIdRequest
  ): Promise<ICountDraftReceiveByWarehouseIdResponse> {
    const count = await this.receiveRepository.countReceiveDraftByWarehouseId(
      request.warehouseId
    );
    return {
      count,
    };
  }
}

export class CountDraftReceiveByWarehouseIdUseCaseFactory {
  static create() {
    const receiveRepository = ReceiveRepositoryFactory.create();
    return new CountDraftReceiveByWarehouseIdUseCase(receiveRepository);
  }
}
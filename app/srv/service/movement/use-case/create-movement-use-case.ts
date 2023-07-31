import { MovementStatus, MovementType } from "../entity/movement-entity";
import { IMovementRepository, MovementRepositoryFactory } from "../repository/movement-repository";

export interface ICreateMovementUseCaseRequest {
  documentDate: Date;
  warehouseId: number;
  movementType: MovementType;
  userIds?: number[];
  productIds?: number[];
  description?: string;
  referenceNumber?: string;
}

export interface ICreateMovementUseCaseResponse {
  id: number;
  documentNumber: string;
  documentDate: Date;
  referenceNumber: string;
  movementType: MovementType;
  description: string;
  status: MovementStatus;
  createdAt: Date;
  updatedAt: Date;
}

export interface ICreateMovementUseCase {
  execute(request: ICreateMovementUseCaseRequest): Promise<ICreateMovementUseCaseResponse>;
}

export class CreateMovementUseCaseImpl implements ICreateMovementUseCase {
  constructor(private movementRepository: IMovementRepository) {}

  async execute(request: ICreateMovementUseCaseRequest): Promise<ICreateMovementUseCaseResponse> {
    const movement = await this.movementRepository.createMovement(
      request.documentDate,
      request.warehouseId,
      request.movementType,
      request.userIds,
      request.productIds,
      request.description,
      request.referenceNumber
    );

    return {
      id: movement.id,
      documentNumber: movement.documentNumber,
      documentDate: movement.documentDate,
      referenceNumber: movement.referenceNumber,
      movementType: movement.movementType,
      description: movement.description,
      status: movement.status,
      createdAt: movement.createdAt,
      updatedAt: movement.updatedAt,
    };
  }
}

export class CreateMovementUseCaseFactory {
  static create(): ICreateMovementUseCase {
    return new CreateMovementUseCaseImpl(MovementRepositoryFactory.create());
  }
}
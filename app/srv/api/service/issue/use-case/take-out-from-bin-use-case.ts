import { BinRepositoryFactory, IBinRepository } from "../../bin/repository/bin-repository";

export interface ITakeOutFromBinUseCaseRequest {
  binId: number;
  issueId: number;
  batchId: number;
}

export interface ITakeOutFromBinUseCaseResponse {
  message: string;
}

export interface ITakeOutFromBinUseCase {
  execute(
    request: ITakeOutFromBinUseCaseRequest
  ): Promise<ITakeOutFromBinUseCaseResponse>;
}

export class TakeOutFromBinUseCase implements ITakeOutFromBinUseCase {
  constructor(private binRepository: IBinRepository) {}

  public async execute(
    request: ITakeOutFromBinUseCaseRequest
  ): Promise<ITakeOutFromBinUseCaseResponse> {
    const binExist = await this.binRepository.findById(request.binId);
    if (!binExist) {
      throw new Error("Bin not found");
    }
    return await this.binRepository.takeOutFromBin(
      request.binId,
      request.issueId,
      request.batchId
    );
  }
}

export class TakeOutFromBinUseCaseFactory {
  static create(): ITakeOutFromBinUseCase {
    return new TakeOutFromBinUseCase(BinRepositoryFactory.create());
  }
}
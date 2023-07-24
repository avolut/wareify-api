import { BinRepositoryFactory, IBinRepository } from "../../bin/repository/bin-repository";
import { BatchRepositoryFactory, IBatchRepository } from "../repository/batch-repository";

export interface IPutAwayToBinUseCaseRequest {
  batchIds: number[];
  binId: number;
}

export interface IPutAwayToBinUseCaseResponse {
  message: string;
}

export interface IPutAwayToBinUseCase {
  execute(request: IPutAwayToBinUseCaseRequest): Promise<IPutAwayToBinUseCaseResponse>;
}

export class PutAwayToBinUseCase implements IPutAwayToBinUseCase {
  constructor(private batchRepository: IBatchRepository, private binRepository: IBinRepository) {}

  public async execute(request: IPutAwayToBinUseCaseRequest): Promise<IPutAwayToBinUseCaseResponse> {
    const { batchIds, binId } = request;
    const batches = await this.batchRepository.findByIds(batchIds);
    const bin = await this.binRepository.findById(binId);

    if (batches.length !== batchIds.length) {
      throw new Error("Some of the batch ids are invalid");
    }

    if (!bin) {
      throw new Error("Bin not found");
    }

    const batchQuantities = batches.map((batch) => batch.quantity);
    const totalQuantity = batchQuantities.reduce((a, b) => a + b, bin.current);

    if (totalQuantity > bin.capacity - bin.current) {
      throw new Error("Bin capacity exceeded");
    }

    await this.batchRepository.putAwayToBin(batchIds, binId, totalQuantity);

    return {
      message: "Successfully put away to bin",
    };
  }
}

export class PutAwayToBinUseCaseFactory {
  public static create(): IPutAwayToBinUseCase {
    return new PutAwayToBinUseCase(BatchRepositoryFactory.create(), BinRepositoryFactory.create());
  }
}
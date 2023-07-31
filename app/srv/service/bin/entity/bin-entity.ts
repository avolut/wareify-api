import { AreaEntity } from "../../area/entity/area-entity";
import { BatchEntity } from "../../batch/entity/batch-entity";

export class BinEntity {
  constructor(
    readonly id: number,
    readonly name: string,
    readonly slug: string,
    readonly description: string,
    readonly code: string,
    readonly capacity: number,
    readonly current: number,
    readonly createdAt: Date,
    readonly updatedAt: Date,
    readonly area: AreaEntity,
    readonly batches: BatchEntity[]
  ) {}
}
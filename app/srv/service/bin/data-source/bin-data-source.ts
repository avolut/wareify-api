import { PrismaClient } from "../../../../../app/db/node_modules/.gen";
import { global } from "../../../global";
import { BinEntity } from "../entity/bin-entity";
import dayjs from "dayjs";

export interface IBinDataSource {
  findBinsByWarehouseId(warehouseId: number): Promise<BinEntity[]>;
  findById(id: number): Promise<BinEntity>;
  takeOutFromBin(binId: number, quantity: number): Promise<any>;
}

export class BinDataSource implements IBinDataSource {
  private timestamps: object;
  constructor(private prisma: PrismaClient, private now: Date) {
    this.timestamps = {
      createdAt: this.now,
      updatedAt: this.now,
    };
  }

  public async findBinsByWarehouseId(
    warehouseId: number
  ): Promise<BinEntity[]> {
    const areas = await this.prisma.area.findMany({
      where: { warehouseId: warehouseId },
      include: {
        bins: {
          include: {
            area: true,
            batches: true,
          },
        },
      },
    });

    const binsData = areas.map((area) => {
      const binData = area.bins.map((bin) => {
        return {
          id: bin.id,
          code: bin.code,
          name: bin.name,
          slug: bin.slug,
          description: bin.description,
          capacity: bin.capacity,
          current: bin.current,
          createdAt: bin.createdAt,
          updatedAt: bin.updatedAt,
          area: bin.area,
          batches: bin.batches,
        };
      });
      return binData;
    });

    const bins = binsData.flat();
    return Promise.all(bins.map((bin) => this.mapToBinEntity(bin)));
  }

  public async findById(id: number): Promise<BinEntity> {
    const bin = await this.prisma.bin.findUnique({
      where: {
        id: id,
      },
      include: {
        area: true,
        batches: true,
      },
    });

    return this.mapToBinEntity(bin);
  }

  public async takeOutFromBin(binId: number, quantity: number): Promise<any> {
    const bin = await this.prisma.bin.findUnique({
      where: {
        id: binId,
      },
    });

    if (bin!.current < quantity) {
      throw new Error("Quantity is not enough");
    }

    await this.prisma.bin.update({
      where: {
        id: binId,
      },
      data: {
        current: bin!.current - quantity,
        updatedAt: this.now,
      },
    });

    return "Success take out from bin";
  }

  private async mapToBinEntity(bin: any): Promise<BinEntity> {
    return new BinEntity(
      bin.id,
      bin.name,
      bin.slug,
      bin.description,
      bin.code,
      bin.capacity,
      bin.current,
      bin.createdAt,
      bin.updatedAt,
      bin.area,
      bin.batches
    );
  }
}

export class BinDataSourceFactory {
  static create(): IBinDataSource {
    return new BinDataSource(
      new PrismaClient(),
      dayjs().add(parseInt(global.UTC_TIMEZONE.toString()), "hour").toDate()
    );
  }
}

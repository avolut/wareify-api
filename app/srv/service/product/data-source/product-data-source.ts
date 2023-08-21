import dayjs from "dayjs";
import { ProductEntity } from "../entity/product-entity";
// import { PrismaClient } from "../../../../../app/db/node_modules/.gen";
import { global } from "../../../global";

export interface IProductDataSource {
  getProductsByOrganizationId(organizationId: number): Promise<ProductEntity[]>;
  getProductById(id: number): Promise<ProductEntity>;
  getProductBySlug(slug: string): Promise<ProductEntity>;
  getProductByType(type: number): Promise<ProductEntity[]>;
}

export class ProductDataSource implements IProductDataSource {
  private timestamps: object;
  constructor(private prisma: any, private now: Date) {
    this.timestamps = {
      createdAt: this.now,
      updatedAt: this.now,
    };
  }

  public async getProductsByOrganizationId(
    organizationId: number
  ): Promise<ProductEntity[]> {
    const products = await this.prisma.product.findMany({
      where: { organizationId: organizationId },
      include: {
        batches: true
      },
    });

    return Promise.all(
      products.map((product) => this.mapToProductEntity(product))
    );
  }

  public async getProductById(id: number): Promise<ProductEntity> {
    const product = await this.prisma.product.findUnique({
      where: { id: id },
    });

    return this.mapToProductEntity(product);
  }

  public async getProductBySlug(slug: string): Promise<ProductEntity> {
    const product = await this.prisma.product.findUnique({
      where: { slug: slug },
    });

    return this.mapToProductEntity(product);
  }

  public async getProductByType(type: number): Promise<ProductEntity[]> {
    const products = await this.prisma.product.findMany({
      where: { productTypeId: type },
    });

    return Promise.all(
      products.map((product) => this.mapToProductEntity(product))
    );
  }

  private async mapToProductEntity(product: any): Promise<ProductEntity> {
    return new ProductEntity(
      product.id,
      product.name,
      product.slug,
      product.description,
      product.sku,
      product.code,
      product.uom,
      product.type,
      product.photo,
      product.createdAt,
      product.updatedAt,
      product.batches
    );
  }
}

export class ProductDataSourceFactory {
  static create(): IProductDataSource {
    return new ProductDataSource(
      db,
      dayjs().add(parseInt(global.UTC_TIMEZONE.toString()), "hour").toDate()
    );
  }
}

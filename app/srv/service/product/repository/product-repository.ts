import { IProductDataSource, ProductDataSourceFactory } from "../data-source/product-data-source";
import { ProductEntity } from "../entity/product-entity";

export interface IProductRepository {
  getProductsByOrganizationId(organizationId: number): Promise<ProductEntity[]>;
  getProductById(id: number): Promise<ProductEntity>;
  getProductBySlug(slug: string): Promise<ProductEntity>;
  getProductByType(type: number): Promise<ProductEntity[]>;
  getProductsByIds(ids: number[]): Promise<ProductEntity[]>;
}

export class ProductRepositoryFactory {
  static create(): IProductRepository {
    return new ProductRepository(ProductDataSourceFactory.create());
  }
}

class ProductRepository implements IProductRepository {
  constructor(private productDataSource: IProductDataSource) {}

  async getProductsByOrganizationId(organizationId: number): Promise<ProductEntity[]> {
    return this.productDataSource.getProductsByOrganizationId(organizationId);
  }

  async getProductById(id: number): Promise<ProductEntity> {
    return this.productDataSource.getProductById(id);
  }

  async getProductBySlug(slug: string): Promise<ProductEntity> {
    return this.productDataSource.getProductBySlug(slug);
  }

  async getProductByType(type: number): Promise<ProductEntity[]> {
    return this.productDataSource.getProductByType(type);
  }

  async getProductsByIds(ids: number[]): Promise<ProductEntity[]> {
    return this.productDataSource.getProductsByIds(ids);
  }
}
import { IProductRepository, ProductRepositoryFactory } from "../repository/product-repository";

export interface IGetProductsByIdsUseCaseRequest {
  ids: number[];
}

export interface IGetProductsByIdsUseCaseResponse {
  id: number;
  name: string;
  slug: string;
  description: string;
  sku: string;
  code: string;
  uom: string;
  photo: string;
  createdAt: Date;
  updatedAt: Date;
  quantity?: number;
  batchQuantity: number;
}

export interface IGetProductsByIdsUseCase {
  execute(
    request: IGetProductsByIdsUseCaseRequest
  ): Promise<IGetProductsByIdsUseCaseResponse[]>;
}

export class GetProductsByIdsUseCase implements IGetProductsByIdsUseCase {
  constructor(private productRepository: IProductRepository) {}

  public async execute(
    request: IGetProductsByIdsUseCaseRequest
  ): Promise<IGetProductsByIdsUseCaseResponse[]> {
    try {
      const products = await this.productRepository.getProductsByIds(
        request.ids
      );

      return products.map((product) => ({
        id: product.id,
        name: product.name,
        slug: product.slug,
        description: product.description,
        sku: product.sku,
        code: product.code,
        uom: product.uom,
        photo: product.photo,
        createdAt: product.createdAt,
        updatedAt: product.updatedAt,
        quantity: product.batches?.reduce(
          (acc, batch) => acc + batch.quantity,
          0
        ),
        batchQuantity: product.batches?.length || 0,
      }));
    } catch (error) {
      throw error;
    }
  }
}

export class GetProductsByIdsUseCaseFactory {
  static create(): IGetProductsByIdsUseCase {
    return new GetProductsByIdsUseCase(ProductRepositoryFactory.create());
  }
}
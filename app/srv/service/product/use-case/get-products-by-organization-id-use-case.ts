import {
  IProductRepository,
  ProductRepositoryFactory,
} from "../repository/product-repository";

export interface IGetProductsByOrganizationIdUseCaseRequest {
  organizationId: number;
}

export interface IGetProductsByOrganizationIdUseCaseResponse {
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

export interface IGetProductsByOrganizationIdUseCase {
  execute(
    request: IGetProductsByOrganizationIdUseCaseRequest
  ): Promise<IGetProductsByOrganizationIdUseCaseResponse[]>;
}

export class GetProductsByOrganizationIdUseCase
  implements IGetProductsByOrganizationIdUseCase
{
  constructor(private productRepository: IProductRepository) {}

  public async execute(
    request: IGetProductsByOrganizationIdUseCaseRequest
  ): Promise<IGetProductsByOrganizationIdUseCaseResponse[]> {
    try {
      const products = await this.productRepository.getProductsByOrganizationId(
        request.organizationId
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
      console.error(`[ListUsersByRoleUseCase][execute][Error] ${error}`);
      throw error;
    }
  }
}

export class GetProductsByOrganizationIdUseCaseFactory {
  public static create(): IGetProductsByOrganizationIdUseCase {
    return new GetProductsByOrganizationIdUseCase(
      ProductRepositoryFactory.create()
    );
  }
}

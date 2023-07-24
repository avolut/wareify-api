import { ProductTypeEntity } from "./product-category-entity";

export class ProductEntity {
  constructor(
    readonly id: number,
    readonly name: string,
    readonly slug: string,
    readonly description: string,
    readonly sku: string,
    readonly code: string,
    readonly photo: string,
    readonly productType: ProductTypeEntity
  ) {}
}
import { ProductTypeEntity } from "./product-category-entity";

export class ProductEntity {
  constructor(
    readonly id: number,
    readonly name: string,
    readonly slug: string,
    readonly description: string,
    readonly sku: string,
    readonly code: string,
    readonly uom: string,
    readonly photo: string,
    readonly createdAt: Date,
    readonly updatedAt: Date,
    readonly productType? : ProductTypeEntity,
  ) {}
}
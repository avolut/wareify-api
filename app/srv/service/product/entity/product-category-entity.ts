import { ProductEntity } from "./product-entity";

export class ProductTypeEntity {
  constructor(
    readonly id: number,
    readonly name: string,
    readonly slug: string,
    readonly description: string,
    readonly createdAt: Date,
    readonly updatedAt: Date,
    readonly products: ProductEntity[],
  ) {}
}
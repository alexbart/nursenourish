import type { Product } from "@nursenourish/shared/types";

export class ProductEntity implements Product {
  id: string;
  name: string;
  slug: string;
  sku: string;
  description: string | null;
  ingredients: string | null;
  usageInstructions: string | null;
  warnings: string | null;
  price: number;
  salePrice: number | null;
  featured: boolean;
  prescriptionRequired: boolean;
  status: string;
  categoryId: string;
  brandId: string;
  createdAt: Date;
  updatedAt: Date;

  constructor(data: Product) {
    this.id = data.id;
    this.name = data.name;
    this.slug = data.slug;
    this.sku = data.sku;
    this.description = data.description;
    this.ingredients = data.ingredients;
    this.usageInstructions = data.usageInstructions;
    this.warnings = data.warnings;
    this.price = data.price;
    this.salePrice = data.salePrice;
    this.featured = data.featured;
    this.prescriptionRequired = data.prescriptionRequired;
    this.status = data.status;
    this.categoryId = data.categoryId;
    this.brandId = data.brandId;
    this.createdAt = data.createdAt;
    this.updatedAt = data.updatedAt;
  }

  static create(
    name: string,
    slug: string,
    sku: string,
    price: number,
    categoryId: string,
    brandId: string,
    options?: {
      description?: string | null;
      ingredients?: string | null;
      usageInstructions?: string | null;
      warnings?: string | null;
      salePrice?: number | null;
      featured?: boolean;
      prescriptionRequired?: boolean;
    }
  ): ProductEntity {
    return new ProductEntity({
      id: crypto.randomUUID(),
      name,
      slug,
      sku,
      description: options?.description ?? null,
      ingredients: options?.ingredients ?? null,
      usageInstructions: options?.usageInstructions ?? null,
      warnings: options?.warnings ?? null,
      price,
      salePrice: options?.salePrice ?? null,
      featured: options?.featured ?? false,
      prescriptionRequired: options?.prescriptionRequired ?? false,
      status: "ACTIVE",
      categoryId,
      brandId,
      createdAt: new Date(),
      updatedAt: new Date(),
    });
  }
}
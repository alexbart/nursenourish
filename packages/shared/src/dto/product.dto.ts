import type { Product } from "../types/product.js";

export interface ProductDTO {
  id: string;
  name: string;
  slug: string;
  sku: string;
  description: string | null;
  price: number;
  salePrice: number | null;
  featured: boolean;
  prescriptionRequired: boolean;
  status: string;
  categoryId: string;
  brandId: string;
  createdAt: Date;
  updatedAt: Date;
}

export const mapProductToDTO = (product: Product): ProductDTO => ({
  id: product.id,
  name: product.name,
  slug: product.slug,
  sku: product.sku,
  description: product.description,
  price: product.price,
  salePrice: product.salePrice,
  featured: product.featured,
  prescriptionRequired: product.prescriptionRequired,
  status: product.status,
  categoryId: product.categoryId,
  brandId: product.brandId,
  createdAt: product.createdAt,
  updatedAt: product.updatedAt,
});

export const mapProductsToDTOs = (products: Product[]): ProductDTO[] => products.map(mapProductToDTO);

export type CreateProductDTO = {
  name: string;
  description?: string | null;
  ingredients?: string | null;
  usageInstructions?: string | null;
  warnings?: string | null;
  price: number;
  salePrice?: number | null;
  categoryId: string;
  brandId: string;
  featured?: boolean;
  prescriptionRequired?: boolean;
  sku?: string;
};
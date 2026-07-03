import type { ProductResponseDto, ProductImageDto, BrandSummaryDto, CategorySummaryDto } from "@nursenourish/shared/dto/product.dto.js";

export function toProductDto(product: {
  id: string;
  name: string;
  slug: string;
  sku: string;
  description: string | null;
  ingredients: string | null;
  usageInstructions: string | null;
  warnings: string | null;
  price: { toNumber: () => number };
  salePrice: { toNumber: () => number } | null;
  featured: boolean;
  prescriptionRequired: boolean;
  status: string;
  brand: { id: string; name: string; slug: string };
  category: { id: string; name: string; slug: string };
  images: ProductImageDto[];
  inventory?: { quantity: number; reservedQuantity: number } | null;
}): ProductResponseDto {
  return {
    id: product.id,
    name: product.name,
    slug: product.slug,
    sku: product.sku,
    description: product.description,
    ingredients: product.ingredients,
    usageInstructions: product.usageInstructions,
    warnings: product.warnings,
    price: product.price.toNumber(),
    salePrice: product.salePrice ? product.salePrice.toNumber() : null,
    featured: product.featured,
    prescriptionRequired: product.prescriptionRequired,
    status: product.status,
    brand: {
      id: product.brand.id,
      name: product.brand.name,
      slug: product.brand.slug,
    },
    category: {
      id: product.category.id,
      name: product.category.name,
      slug: product.category.slug,
    },
    images: product.images,
    inventory: product.inventory ? {
      quantity: product.inventory.quantity,
      reservedQuantity: product.inventory.reservedQuantity,
    } : undefined,
  };
}
export interface BrandSummaryDto {
  id: string;
  name: string;
  slug: string;
}

export interface CategorySummaryDto {
  id: string;
  name: string;
  slug: string;
}

export interface ProductImageDto {
  id: string;
  imageUrl: string;
  altText?: string | null;
  sortOrder?: number;
  isPrimary?: boolean;
}

export interface ProductSummaryDto {
  id: string;
  name: string;
  slug: string;
  sku: string;
  price: number;
  salePrice: number | null;
  thumbnail: string | null;
  brand: BrandSummaryDto;
  category: CategorySummaryDto;
}

export interface ProductResponseDto {
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
  brand: BrandSummaryDto;
  category: CategorySummaryDto;
  images: ProductImageDto[];
  inventory?: {
    quantity: number;
    reservedQuantity: number;
  } | undefined;
}

export interface CreateProductDto {
  name: string;
  description?: string | undefined;
  ingredients?: string | undefined;
  usageInstructions?: string | undefined;
  warnings?: string | undefined;
  packSize?: string | undefined;
  price: number;
  salePrice?: number | undefined;
  categoryId: string;
  brandId: string;
  featured?: boolean | undefined;
  prescriptionRequired?: boolean | undefined;
  images?: Array<{ imageUrl: string; altText?: string | undefined }> | undefined;
  sku?: string | undefined;
}

export interface UpdateProductDto {
  name?: string | undefined;
  description?: string | undefined;
  ingredients?: string | undefined;
  usageInstructions?: string | undefined;
  warnings?: string | undefined;
  price?: number | undefined;
  salePrice?: number | undefined;
  categoryId?: string | undefined;
  brandId?: string | undefined;
  featured?: boolean | undefined;
  prescriptionRequired?: boolean | undefined;
  images?: Array<{ imageUrl: string; altText?: string | undefined }> | undefined;
}

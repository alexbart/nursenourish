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
  };
}

export interface CreateProductDto {
  name: string;
  description?: string;
  ingredients?: string;
  usageInstructions?: string;
  warnings?: string;
  price: number;
  salePrice?: number;
  categoryId: string;
  brandId: string;
  featured?: boolean;
  prescriptionRequired?: boolean;
  images?: Array<{ imageUrl: string }>;
  sku?: string;
}

export interface UpdateProductDto {
  name?: string;
  description?: string;
  ingredients?: string;
  usageInstructions?: string;
  warnings?: string;
  price?: number;
  salePrice?: number;
  categoryId?: string;
  brandId?: string;
  featured?: boolean;
  prescriptionRequired?: boolean;
  images?: Array<{ imageUrl: string }>;
}
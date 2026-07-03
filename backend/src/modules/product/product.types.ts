export interface ProductQuery {
  page?: number;
  limit?: number;

  search?: string;

  sku?: string;

  category?: string;

  brand?: string;

  minPrice?: number;
  maxPrice?: number;

  featured?: boolean;

  inStock?: boolean;

  prescriptionRequired?: boolean;

  sortBy?: "createdAt" | "name" | "price";
  order?: "asc" | "desc";
}
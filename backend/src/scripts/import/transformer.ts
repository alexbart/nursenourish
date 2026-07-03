import type { ExcelProductRow } from "./row-validator.js";
import type { CreateProductDto } from "@nursenourish/shared/dto/product.dto.js";

export function transformRowToDto(row: ExcelProductRow, categoryId: string, brandId: string): CreateProductDto {
  return {
    name: row.productName,
    description: row.ingredients || undefined,
    ingredients: row.ingredients || undefined,
    categoryId,
    brandId,
    price: row.retailPrice,
    sku: row.sku,
    packSize: row.packSize,
    featured: false,
    prescriptionRequired: false,
  };
}
import { z } from "zod";

export const excelProductRowSchema = z.object({
  sku: z.string().min(1, "SKU is required"),
  productName: z.string().min(1, "Product name is required"),
  ingredients: z.string().optional(),
  category: z.string().min(1, "Category is required"),
  packSize: z.string().optional(),
  retailPrice: z.number().positive("Retail price must be positive"),
});

export type ExcelProductRow = z.infer<typeof excelProductRowSchema>;

export function validateRow(row: unknown): ExcelProductRow | null {
  const result = excelProductRowSchema.safeParse(row);
  if (!result.success) {
    return null;
  }
  return result.data;
}
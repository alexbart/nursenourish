import { z } from "zod";

export const createCategorySchema = z.object({
  name: z.string().min(2, "Category name must be at least 2 characters").max(100),
  description: z.string().max(500).optional(),
});

export const createBrandSchema = z.object({
  name: z.string().min(2, "Brand name must be at least 2 characters").max(100),
  description: z.string().max(500).optional(),
});

export const createProductSchema = z.object({
  name: z.string().min(2).max(255),
  description: z.string().optional(),
  ingredients: z.string().optional(),
  usageInstructions: z.string().optional(),
  warnings: z.string().optional(),
  price: z.coerce.number().positive(),
  salePrice: z.coerce.number().positive().optional(),
  categoryId: z.string().uuid(),
  brandId: z.string().uuid(),
  featured: z.boolean().optional(),
  prescriptionRequired: z.boolean().optional(),
  images: z
    .array(
      z.object({
        imageUrl: z.string().url(),
      })
    )
    .optional(),
  sku: z.string().optional(),
});

export type CreateCategoryInput = z.infer<typeof createCategorySchema>;
export type CreateBrandInput = z.infer<typeof createBrandSchema>;
export type CreateProductInput = z.infer<typeof createProductSchema>;
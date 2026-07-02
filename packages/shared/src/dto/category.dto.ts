import type { Category } from "../types/category.js";

export interface CategoryDTO {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  createdAt: Date;
  updatedAt: Date;
}

export const mapCategoryToDTO = (category: Category): CategoryDTO => ({
  id: category.id,
  name: category.name,
  slug: category.slug,
  description: category.description,
  createdAt: category.createdAt,
  updatedAt: category.updatedAt,
});

export const mapCategoriesToDTOs = (categories: Category[]): CategoryDTO[] =>
  categories.map(mapCategoryToDTO);

export type CreateCategoryDTO = { name: string; description?: string | null };
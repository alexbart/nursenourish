import type { Brand } from "../types/brand.js";

export interface BrandDTO {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  createdAt: Date;
  updatedAt: Date;
}

export const mapBrandToDTO = (brand: Brand): BrandDTO => ({
  id: brand.id,
  name: brand.name,
  slug: brand.slug,
  description: brand.description,
  createdAt: brand.createdAt,
  updatedAt: brand.updatedAt,
});

export const mapBrandsToDTOs = (brands: Brand[]): BrandDTO[] => brands.map(mapBrandToDTO);

export type CreateBrandDTO = { name: string; description?: string | null };
export type UpdateBrandDTO = { name?: string; description?: string | null };
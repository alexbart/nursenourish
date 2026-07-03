import type { BrandResponseDto } from "@nursenourish/shared/dto/brand.dto.js";

export function toBrandDto(brand: {
  id: string;
  name: string;
  slug: string;
  description: string | null;
}): BrandResponseDto {
  return {
    id: brand.id,
    name: brand.name,
    slug: brand.slug,
    description: brand.description,
  };
}
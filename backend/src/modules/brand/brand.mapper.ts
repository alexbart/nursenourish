import type { BrandResponseDto } from "@nursenourish/shared";

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
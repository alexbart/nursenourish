import type { CategoryResponseDto } from "@nursenourish/shared";

export function toCategoryDto(category: {
  id: string;
  name: string;
  slug: string;
  description: string | null;
}): CategoryResponseDto {
  return {
    id: category.id,
    name: category.name,
    slug: category.slug,
    description: category.description,
  };
}

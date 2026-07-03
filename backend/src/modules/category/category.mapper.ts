import type { CategoryResponseDto } from "@nursenourish/shared/dto/category.dto.js";
import type { CategoryWithProducts } from "./category.repository.js";

export function toCategoryDto(category: CategoryWithProducts): CategoryResponseDto {
  return {
    id: category.id,
    name: category.name,
    slug: category.slug,
    description: category.description,
  };
}
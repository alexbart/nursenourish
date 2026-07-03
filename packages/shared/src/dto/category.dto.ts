export interface CategoryResponseDto {
  id: string;
  name: string;
  slug: string;
  description: string | null;
}

export interface CreateCategoryDto {
  name: string;
  description?: string;
}

export interface UpdateCategoryDto {
  name?: string;
  description?: string;
}
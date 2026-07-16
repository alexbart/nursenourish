export interface CategoryResponseDto {
  id: string;
  name: string;
  slug: string;
  description: string | null;
}

export interface CreateCategoryDto {
  name: string;
  description?: string | undefined;
}

export interface UpdateCategoryDto {
  name?: string | undefined;
  description?: string | undefined;
}

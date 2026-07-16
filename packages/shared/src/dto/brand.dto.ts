export interface BrandResponseDto {
  id: string;
  name: string;
  slug: string;
  description: string | null;
}

export interface CreateBrandDto {
  name: string;
  description?: string | undefined;
}

export interface UpdateBrandDto {
  name?: string | undefined;
  description?: string | undefined;
}

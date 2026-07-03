export interface BrandResponseDto {
  id: string;
  name: string;
  slug: string;
  description: string | null;
}

export interface CreateBrandDto {
  name: string;
  description?: string;
}

export interface UpdateBrandDto {
  name?: string;
  description?: string;
}
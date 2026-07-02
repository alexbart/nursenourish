import slugify from "slugify";

import { ApiError } from "../../../shared/ApiError.js";
import { ErrorCodes } from "@nursenourish/shared/constants/error-codes.js";
import type { BrandRepositoryInterface } from "../domain/brand.repository.interface.js";
import type { BrandDTO, CreateBrandInput } from "@nursenourish/shared";
import { mapBrandToDTO, mapBrandsToDTOs } from "@nursenourish/shared";

export class BrandService {
  constructor(private readonly repository: BrandRepositoryInterface) {}

  async createBrand(data: CreateBrandInput): Promise<BrandDTO> {
    const slug = slugify(data.name, {
      lower: true,
      strict: true,
    });

    const existingBrand = await this.repository.findBySlug(slug);

    if (existingBrand) {
      throw new ApiError(409, "Brand already exists", ErrorCodes.BRAND_ALREADY_EXISTS);
    }

    const brand = await this.repository.create({
      data: {
        name: data.name,
        slug,
        description: data.description ?? null,
      },
    });

    return mapBrandToDTO(brand);
  }

  async getAllBrands(): Promise<BrandDTO[]> {
    const brands = await this.repository.findMany({
      orderBy: { createdAt: "desc" },
    });

    return mapBrandsToDTOs(brands);
  }

  async getBrandById(id: string): Promise<BrandDTO> {
    const brand = await this.repository.findById(id);

    if (!brand) {
      throw new ApiError(404, "Brand not found", ErrorCodes.BRAND_NOT_FOUND);
    }

    return mapBrandToDTO(brand);
  }

  async deleteBrand(id: string): Promise<void> {
    const brand = await this.repository.findById(id);

    if (!brand) {
      throw new ApiError(404, "Brand not found", ErrorCodes.BRAND_NOT_FOUND);
    }

    await this.repository.delete(id);
  }
}
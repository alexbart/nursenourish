import { brandRepository } from "./brand.repository.js";
import { toBrandDto } from "./brand.mapper.js";
import { ApiError } from "../../shared/ApiError.js";
import { ErrorCodes, HttpStatus } from "@nursenourish/shared";
import type { CreateBrandInput, UpdateBrandInput } from "./brand.validator.js";
import type { BrandResponseDto } from "@nursenourish/shared/dto/brand.dto.js";

export class BrandService {
  async create(data: CreateBrandInput): Promise<BrandResponseDto> {
    const slug = this.generateSlug(data.name);
    
    const exists = await brandRepository.existsBySlug(slug);
    if (exists) {
      throw new ApiError(
        HttpStatus.CONFLICT,
        ErrorCodes.BRAND_ALREADY_EXISTS,
        "Brand already exists."
      );
    }

    const brand = await brandRepository.create({
      name: data.name,
      description: data.description,
    });

    return toBrandDto(brand);
  }

  async findAll() {
    const brands = await brandRepository.findAll();
    return brands.map(toBrandDto);
  }

  async findById(id: string): Promise<BrandResponseDto> {
    const brand = await brandRepository.findById(id);

    if (!brand) {
      throw new ApiError(
        HttpStatus.NOT_FOUND,
        ErrorCodes.BRAND_NOT_FOUND,
        "Brand not found."
      );
    }

    return toBrandDto(brand);
  }

  async update(id: string, data: UpdateBrandInput): Promise<BrandResponseDto> {
    const brand = await brandRepository.findById(id);

    if (!brand) {
      throw new ApiError(
        HttpStatus.NOT_FOUND,
        ErrorCodes.BRAND_NOT_FOUND,
        "Brand not found."
      );
    }

    if (data.name) {
      const slug = this.generateSlug(data.name);
      const exists = await brandRepository.existsBySlug(slug);
      if (exists && slug !== brand.slug) {
        throw new ApiError(
          HttpStatus.CONFLICT,
          ErrorCodes.BRAND_ALREADY_EXISTS,
          "Brand already exists."
        );
      }
    }

    const updated = await brandRepository.update(id, data);
    return toBrandDto(updated);
  }

  async delete(id: string): Promise<void> {
    const brand = await brandRepository.findById(id);

    if (!brand) {
      throw new ApiError(
        HttpStatus.NOT_FOUND,
        ErrorCodes.BRAND_NOT_FOUND,
        "Brand not found."
      );
    }

    await brandRepository.delete(id);
  }

  private generateSlug(name: string): string {
    return name.toLowerCase().replace(/\s+/g, "-").replace(/[^a-z0-9-]/g, "");
  }
}

export const brandService = new BrandService();
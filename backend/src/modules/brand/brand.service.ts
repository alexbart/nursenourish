import slugify from "slugify";

import { prisma } from "../../prisma/prisma.js";
import { ApiError } from "../../shared/ApiError.js";
import { ErrorCodes, HttpStatus } from "@nursenourish/shared";
import type { CreateBrandInput } from "./brand.validator.js";

export class BrandService {
  async createBrand(data: CreateBrandInput) {
    const slug = slugify(data.name, {
      lower: true,
      strict: true,
    });

    const existingBrand = await prisma.brand.findUnique({
      where: {
        slug,
      },
    });

    if (existingBrand) {
      throw new ApiError(HttpStatus.CONFLICT, ErrorCodes.BRAND_ALREADY_EXISTS, "Brand already exists");
    }

    return prisma.brand.create({
      data: {
        name: data.name,
        slug,
        description: data.description ?? null,
      },
    });
  }

  async getAllBrands() {
    return prisma.brand.findMany({
      orderBy: {
        createdAt: "desc",
      },
    });
  }

  async getBrandById(id: string) {
    const brand = await prisma.brand.findUnique({
      where: {
        id,
      },
    });

    if (!brand) {
      throw new ApiError(HttpStatus.NOT_FOUND, ErrorCodes.BRAND_NOT_FOUND, "Brand not found");
    }

    return brand;
  }

  async deleteBrand(id: string) {
    const brand = await prisma.brand.findUnique({
      where: {
        id,
      },
    });

    if (!brand) {
      throw new ApiError(HttpStatus.NOT_FOUND, ErrorCodes.BRAND_NOT_FOUND, "Brand not found");
    }

    await prisma.brand.delete({
      where: {
        id,
      },
    });

    return true;
  }
}

export const brandService = new BrandService();

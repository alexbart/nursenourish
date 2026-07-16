import { prisma } from "../../prisma/prisma.js";
import { createSlug } from "../../shared/utils/slug.js";
import type { CreateBrandDto, UpdateBrandDto } from "@nursenourish/shared";

export class BrandRepository {
  async create(data: CreateBrandDto) {
    return prisma.brand.create({
      data: {
        name: data.name,
        slug: createSlug(data.name),
        description: data.description ?? null,
      },
    });
  }

  async update(id: string, data: UpdateBrandDto) {
    return prisma.brand.update({
      where: { id },
      data: {
        ...(data.name !== undefined ? { name: data.name, slug: createSlug(data.name) } : {}),
        ...(data.description !== undefined ? { description: data.description } : {}),
      },
    });
  }

  async delete(id: string) {
    return prisma.brand.delete({
      where: { id },
    });
  }

  async findAll() {
    return prisma.brand.findMany({
      orderBy: { createdAt: "desc" },
    });
  }

  async findById(id: string) {
    return prisma.brand.findUnique({
      where: { id },
    });
  }

  async findBySlug(slug: string) {
    return prisma.brand.findUnique({
      where: { slug },
    });
  }

  async existsBySlug(slug: string) {
    const count = await prisma.brand.count({
      where: { slug },
    });
    return count > 0;
  }
}

export const brandRepository = new BrandRepository();

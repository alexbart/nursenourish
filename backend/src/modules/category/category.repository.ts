import { prisma } from "../../prisma/prisma.js";
import type { CreateCategoryDto, UpdateCategoryDto } from "@nursenourish/shared";

export class CategoryRepository {
  async findAll() {
    return prisma.category.findMany({
      orderBy: { createdAt: "desc" },
    });
  }

  async findById(id: string) {
    return prisma.category.findUnique({
      where: { id },
    });
  }

  async findBySlug(slug: string) {
    return prisma.category.findUnique({
      where: { slug },
      include: { products: true },
    });
  }

  async create(data: CreateCategoryDto) {
    return prisma.category.create({
      data: {
        name: data.name,
        slug: this.generateSlug(data.name),
        description: data.description ?? null,
      },
    });
  }

  async update(id: string, data: UpdateCategoryDto) {
    return prisma.category.update({
      where: { id },
      data: {
        ...(data.name !== undefined ? { name: data.name, slug: this.generateSlug(data.name) } : {}),
        ...(data.description !== undefined ? { description: data.description } : {}),
      },
    });
  }

  async delete(id: string) {
    return prisma.category.delete({
      where: { id },
    });
  }

  async existsBySlug(slug: string) {
    const count = await prisma.category.count({
      where: { slug },
    });
    return count > 0;
  }

  private generateSlug(name: string): string {
    return name.toLowerCase().replace(/\s+/g, "-").replace(/[^a-z0-9-]/g, "");
  }
}

export const categoryRepository = new CategoryRepository();

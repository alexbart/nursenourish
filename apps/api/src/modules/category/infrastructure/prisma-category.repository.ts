import { prisma } from "../../../prisma/prisma.js";
import type { Category } from "@nursenourish/shared/types";
import type { CategoryRepositoryInterface } from "../domain/category.repository.interface.js";

export class PrismaCategoryRepository implements CategoryRepositoryInterface {
  async findById(id: string): Promise<Category | null> {
    return prisma.category.findUnique({ where: { id } });
  }

  async findBySlug(slug: string): Promise<Category | null> {
    return prisma.category.findUnique({ where: { slug } });
  }

  async findMany(args?: { orderBy?: Record<string, any>; skip?: number; take?: number }): Promise<Category[]> {
    return prisma.category.findMany(args ?? {});
  }

  async create(data: { name: string; slug: string; description?: string | null }): Promise<Category> {
    return prisma.category.create({ data });
  }

  async delete(id: string): Promise<void> {
    await prisma.category.delete({ where: { id } });
  }
}
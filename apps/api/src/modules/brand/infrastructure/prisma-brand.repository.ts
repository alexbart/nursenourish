import { prisma } from "../../../prisma/prisma.js";
import type { Brand } from "@nursenourish/shared/types";
import type { Prisma } from "@prisma/client";
import type { BrandRepositoryInterface } from "../domain/brand.repository.interface.js";

export class PrismaBrandRepository implements BrandRepositoryInterface {
  async findBySlug(slug: string): Promise<Brand | null> {
    return prisma.brand.findUnique({ where: { slug } }) as unknown as Brand | null;
  }

  async findById(id: string): Promise<Brand | null> {
    return prisma.brand.findUnique({ where: { id } }) as unknown as Brand | null;
  }

  async create(data: Prisma.BrandCreateArgs): Promise<Brand> {
    return prisma.brand.create(data) as unknown as Brand;
  }

  async update(id: string, data: Prisma.BrandUpdateArgs["data"]): Promise<Brand> {
    return prisma.brand.update({ where: { id }, data }) as unknown as Brand;
  }

  async delete(id: string): Promise<void> {
    await prisma.brand.delete({ where: { id } });
  }

  async findMany(params?: {
    orderBy?: any;
    skip?: number;
    take?: number;
  }): Promise<Brand[]> {
    return prisma.brand.findMany(params) as unknown as Brand[];
  }
}

export const brandRepository = new PrismaBrandRepository();
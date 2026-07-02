import { prisma } from "../../../prisma/prisma.js";
import type { Product } from "@nursenourish/shared/types";
import type { Prisma } from "@prisma/client";
import type { ProductRepositoryInterface } from "../domain/product.repository.interface.js";

export class PrismaProductRepository implements ProductRepositoryInterface {
  private readonly defaultInclude = {
    category: true,
    brand: true,
    images: true,
    inventory: true,
  };

  async findBySlug(slug: string): Promise<Product | null> {
    return prisma.product.findUnique({
      where: { slug },
      include: this.defaultInclude,
    }) as unknown as Product | null;
  }

  async findBySku(sku: string): Promise<Product | null> {
    return prisma.product.findUnique({
      where: { sku },
    }) as unknown as Product | null;
  }

  async findById(id: string): Promise<Product | null> {
    return prisma.product.findUnique({
      where: { id },
      include: this.defaultInclude,
    }) as unknown as Product | null;
  }

  async create(data: Prisma.ProductCreateArgs): Promise<Product> {
    return prisma.product.create({
      ...data,
      include: this.defaultInclude,
    }) as unknown as Product;
  }

  async findCategoryById(id: string) {
    return prisma.category.findUnique({ where: { id } });
  }

  async findBrandById(id: string) {
    return prisma.brand.findUnique({ where: { id } });
  }

  async update(id: string, data: Prisma.ProductUpdateArgs["data"]): Promise<Product> {
    return prisma.product.update({
      where: { id },
      data,
      include: this.defaultInclude,
    }) as unknown as Product;
  }

  async delete(id: string): Promise<void> {
    await prisma.product.delete({ where: { id } });
  }

  async findMany(params: {
    where?: any;
    include?: any;
    orderBy?: any;
    skip?: number;
    take?: number;
  }): Promise<Product[]> {
    return prisma.product.findMany(params) as unknown as Product[];
  }

  async count(where?: any): Promise<number> {
    return prisma.product.count(where);
  }
}

export const productRepository = new PrismaProductRepository();
import type { Product, Category, Brand } from "@nursenourish/shared/types";
import type { Prisma } from "@prisma/client";

export interface ProductRepositoryInterface {
  create(data: Prisma.ProductCreateArgs): Promise<Product>;
  findById(id: string): Promise<Product | null>;
  findBySlug(slug: string): Promise<Product | null>;
  findBySku(sku: string): Promise<Product | null>;
  findCategoryById(id: string): Promise<Category | null>;
  findBrandById(id: string): Promise<Brand | null>;
  findMany(params: {
    where?: any;
    include?: any;
    orderBy?: any;
    skip?: number;
    take?: number;
  }): Promise<Product[]>;
  count(where?: any): Promise<number>;
  update(id: string, data: Prisma.ProductUpdateArgs["data"]): Promise<Product>;
  delete(id: string): Promise<void>;
}

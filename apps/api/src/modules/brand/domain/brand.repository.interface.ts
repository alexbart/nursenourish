import type { Brand } from "@nursenourish/shared/types";
import type { Prisma } from "@prisma/client";

export interface BrandRepositoryInterface {
  create(data: Prisma.BrandCreateArgs): Promise<Brand>;
  findById(id: string): Promise<Brand | null>;
  findBySlug(slug: string): Promise<Brand | null>;
  findMany(params?: {
    orderBy?: any;
    skip?: number;
    take?: number;
  }): Promise<Brand[]>;
  update(id: string, data: Prisma.BrandUpdateArgs["data"]): Promise<Brand>;
  delete(id: string): Promise<void>;
}
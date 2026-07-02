import type { Category } from "@nursenourish/shared/types";

export interface CategoryRepositoryInterface {
  findById(id: string): Promise<Category | null>;
  findBySlug(slug: string): Promise<Category | null>;
  findMany(args?: {
    orderBy?: Record<string, any>;
    skip?: number;
    take?: number;
  }): Promise<Category[]>;
  create(data: { name: string; slug: string; description?: string | null }): Promise<Category>;
  delete(id: string): Promise<void>;
}
import type { Category } from "@nursenourish/shared/types";

export class CategoryEntity implements Category {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  createdAt: Date;
  updatedAt: Date;

  constructor(data: Category) {
    this.id = data.id;
    this.name = data.name;
    this.slug = data.slug;
    this.description = data.description;
    this.createdAt = data.createdAt;
    this.updatedAt = data.updatedAt;
  }

  static create(name: string, slug: string, description: string | null = null): CategoryEntity {
    return new CategoryEntity({
      id: crypto.randomUUID(),
      name,
      slug,
      description,
      createdAt: new Date(),
      updatedAt: new Date(),
    });
  }
}
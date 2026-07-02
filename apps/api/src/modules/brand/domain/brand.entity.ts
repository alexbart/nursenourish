import type { Brand } from "@nursenourish/shared/types";

export class BrandEntity implements Brand {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  createdAt: Date;
  updatedAt: Date;

  constructor(data: Brand) {
    this.id = data.id;
    this.name = data.name;
    this.slug = data.slug;
    this.description = data.description;
    this.createdAt = data.createdAt;
    this.updatedAt = data.updatedAt;
  }

  static create(name: string, slug: string, description: string | null = null): BrandEntity {
    return new BrandEntity({
      id: crypto.randomUUID(),
      name,
      slug,
      description,
      createdAt: new Date(),
      updatedAt: new Date(),
    });
  }
}
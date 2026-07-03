import { prisma } from "../../prisma/prisma.js";
import { createSlug } from "../../shared/utils/slug.js";
import type { ProductQuery } from "./product.types.js";
import type { CreateProductDto } from "@nursenourish/shared/dto/product.dto.js";

export type ProductWithRelations = Awaited<ReturnType<typeof prisma.product.findUnique<{
  include: {
    category: true;
    brand: true;
    images: true;
    inventory: true;
  };
}>>>;

export interface ProductSearchCriteria extends ProductQuery {
  sortBy?: "name" | "price" | "createdAt";
  order?: "asc" | "desc";
}

export class ProductRepository {
  async create(data: CreateProductDto, tx?: typeof prisma) {
    const client = tx || prisma;
    return client.product.create({
      data: {
        name: data.name,
        slug: await this.generateUniqueSlug(data.name, tx),
        sku: data.sku ?? await this.generateSKU(data),
        description: data.description ?? null,
        ingredients: data.ingredients ?? null,
        usageInstructions: data.usageInstructions ?? null,
        warnings: data.warnings ?? null,
        price: data.price,
        salePrice: data.salePrice ?? null,
        featured: data.featured ?? false,
        prescriptionRequired: data.prescriptionRequired ?? false,
        categoryId: data.categoryId,
        brandId: data.brandId,
        images: {
          create: data.images?.map((image) => ({
            imageUrl: image.imageUrl,
          })) ?? [],
        },
      },
      include: {
        category: true,
        brand: true,
        images: true,
        inventory: true,
      },
    });
  }

  async update(id: string, data: Partial<CreateProductDto>, tx?: typeof prisma) {
    const client = tx || prisma;
    return client.product.update({
      where: { id },
      data: {
        name: data.name,
        slug: data.name ? await this.generateUniqueSlug(data.name, tx) : undefined,
        sku: data.sku,
        description: data.description,
        ingredients: data.ingredients,
        usageInstructions: data.usageInstructions,
        warnings: data.warnings,
        price: data.price,
        salePrice: data.salePrice,
        featured: data.featured,
        prescriptionRequired: data.prescriptionRequired,
        categoryId: data.categoryId,
        brandId: data.brandId,
        images: data.images ? {
          create: data.images.map((image) => ({
            imageUrl: image.imageUrl,
          })),
        } : undefined,
      },
      include: {
        category: true,
        brand: true,
        images: true,
        inventory: true,
      },
    });
  }

  async delete(id: string, tx?: typeof prisma) {
    const client = tx || prisma;
    return client.product.delete({
      where: { id },
    });
  }

  async findById(id: string, tx?: typeof prisma) {
    const client = tx || prisma;
    return client.product.findUnique({
      where: { id },
      include: {
        category: true,
        brand: true,
        images: true,
        inventory: true,
      },
    });
  }

  async findBySlug(slug: string, tx?: typeof prisma) {
    const client = tx || prisma;
    return client.product.findUnique({
      where: { slug },
      include: {
        category: true,
        brand: true,
        images: true,
        inventory: true,
      },
    });
  }

  async findBySku(sku: string, tx?: typeof prisma) {
    const client = tx || prisma;
    return client.product.findUnique({
      where: { sku },
      include: {
        category: true,
        brand: true,
        images: true,
        inventory: true,
      },
    });
  }

  async search(criteria: ProductSearchCriteria) {
    const page = Number(criteria.page) || 1;
    const limit = Number(criteria.limit) || 20;
    const skip = (page - 1) * limit;

    const where: any = {};

    if (criteria.search) {
      where.OR = [
        { name: { contains: criteria.search, mode: "insensitive" } },
        { brand: { name: { contains: criteria.search, mode: "insensitive" } } },
        { category: { name: { contains: criteria.search, mode: "insensitive" } } },
      ];
    }

    if (criteria.sku) {
      where.sku = { contains: criteria.sku, mode: "insensitive" };
    }

    if (criteria.featured !== undefined) {
      where.featured = criteria.featured === true || criteria.featured === "true";
    }

    if (criteria.category) {
      where.category = { slug: criteria.category };
    }

    if (criteria.brand) {
      where.brand = { slug: criteria.brand };
    }

    if (criteria.minPrice !== undefined || criteria.maxPrice !== undefined) {
      where.price = {};
      if (criteria.minPrice !== undefined) where.price.gte = criteria.minPrice;
      if (criteria.maxPrice !== undefined) where.price.lte = criteria.maxPrice;
    }

    if (criteria.inStock) {
      where.inventory = { quantity: { gt: 0 } };
    }

    if (criteria.prescriptionRequired !== undefined) {
      where.prescriptionRequired = criteria.prescriptionRequired;
    }

    let orderBy: any = { createdAt: "desc" };
    if (criteria.sortBy === "price" && criteria.order === "asc") orderBy = { price: "asc" };
    else if (criteria.sortBy === "price" && criteria.order === "desc") orderBy = { price: "desc" };
    else if (criteria.sortBy === "name" && criteria.order === "asc") orderBy = { name: "asc" };
    else if (criteria.sortBy === "name" && criteria.order === "desc") orderBy = { name: "desc" };

    const [products, total] = await Promise.all([
      prisma.product.findMany({
        where,
        include: { category: true, brand: true, images: true, inventory: true },
        orderBy,
        skip,
        take: limit,
      }),
      prisma.product.count({ where }),
    ]);

    return {
      products,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit),
      },
    };
  }

  private async generateUniqueSlug(name: string, tx?: typeof prisma): Promise<string> {
    const baseSlug = createSlug(name);
    const client = tx || prisma;
    let slug = baseSlug;
    let counter = 1;

    while (await client.product.count({ where: { slug } }) > 0) {
      slug = `${baseSlug}-${counter}`;
      counter++;
    }

    return slug;
  }

  private async generateSKU(data: CreateProductDto): Promise<string> {
    const category = await prisma.category.findUnique({
      where: { id: data.categoryId },
    });

    const prefix = category?.name.substring(0, 3).toUpperCase() || "PRD";
    const count = await prisma.product.count();
    const number = String(count + 1).padStart(6, "0");

    return `NN-${prefix}-${number}`;
  }
}

export const productRepository = new ProductRepository();
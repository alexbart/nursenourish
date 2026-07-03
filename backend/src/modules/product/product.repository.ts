import { prisma } from "../../prisma/prisma.js";
import type { ProductQuery } from "./product.types.js";
import type { CreateProductDto, ProductResponseDto } from "@nursenourish/shared/dto/product.dto.js";

export type ProductWithRelations = Awaited<ReturnType<typeof prisma.product.findUnique<{
  include: {
    category: true;
    brand: true;
    images: true;
    inventory: true;
  };
}>>>;

export class ProductRepository {
  async create(data: CreateProductDto): Promise<ProductWithRelations> {
    return prisma.product.create({
      data: {
        name: data.name,
        slug: this.generateSlug(data.name),
        sku: data.sku ?? this.generateSku(),
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

  async update(id: string, data: Partial<CreateProductDto>): Promise<ProductWithRelations> {
    return prisma.product.update({
      where: { id },
      data: {
        name: data.name,
        slug: data.name ? this.generateSlug(data.name) : undefined,
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

  async delete(id: string): Promise<void> {
    await prisma.product.delete({
      where: { id },
    });
  }

  async findById(id: string): Promise<ProductWithRelations | null> {
    return prisma.product.findUnique({
      where: { id },
      include: {
        category: true,
        brand: true,
        images: true,
        inventory: true,
      },
    });
  }

  async findBySlug(slug: string): Promise<ProductWithRelations | null> {
    return prisma.product.findUnique({
      where: { slug },
      include: {
        category: true,
        brand: true,
        images: true,
        inventory: true,
      },
    });
  }

  async findBySku(sku: string): Promise<ProductWithRelations | null> {
    return prisma.product.findUnique({
      where: { sku },
      include: {
        category: true,
        brand: true,
        images: true,
        inventory: true,
      },
    });
  }

  async findMany(query: ProductQuery) {
    const page = Number(query.page) || 1;
    const limit = Number(query.limit) || 20;
    const skip = (page - 1) * limit;

    const where: any = {};

    if (query.search) {
      where.OR = [
        { name: { contains: query.search, mode: "insensitive" } },
        { brand: { name: { contains: query.search, mode: "insensitive" } } },
        { category: { name: { contains: query.search, mode: "insensitive" } } },
      ];
    }

    if (query.sku) {
      where.sku = { contains: query.sku, mode: "insensitive" };
    }

    if (query.featured !== undefined) {
      where.featured = query.featured;
    }

    if (query.category) {
      where.category = { slug: query.category };
    }

    if (query.brand) {
      where.brand = { slug: query.brand };
    }

    if (query.minPrice !== undefined || query.maxPrice !== undefined) {
      where.price = {};
      if (query.minPrice !== undefined) where.price.gte = query.minPrice;
      if (query.maxPrice !== undefined) where.price.lte = query.maxPrice;
    }

    if (query.inStock) {
      where.inventory = { quantity: { gt: 0 } };
    }

    if (query.prescriptionRequired !== undefined) {
      where.prescriptionRequired = query.prescriptionRequired;
    }

    let orderBy: any = { createdAt: "desc" };
    if (query.sortBy === "price_asc") orderBy = { price: "asc" };
    else if (query.sortBy === "price_desc") orderBy = { price: "desc" };

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

  private generateSku(): string {
    const ts = Date.now().toString(36).toUpperCase();
    const rand = Math.random().toString(36).substring(2, 6).toUpperCase();
    return `SKU-${ts}-${rand}`;
  }

  private generateSlug(name: string): string {
    return name.toLowerCase().replace(/\s+/g, "-").replace(/[^a-z0-9-]/g, "");
  }
}

export const productRepository = new ProductRepository();
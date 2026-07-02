import slugify from "slugify";

import { ApiError } from "../../../shared/ApiError.js";
import { ErrorCodes } from "@nursenourish/shared";
import { storageService } from "../../../services/storage/index.js";
import { getPagination } from "../../../shared/pagination.js";
import type { ProductRepositoryInterface } from "../domain/product.repository.interface.js";
import type { ProductDTO } from "@nursenourish/shared/dto";
import type { CreateProductInput } from "@nursenourish/shared/schemas";

export interface ProductQuery {
  page?: number;
  limit?: number;
  search?: string;
  sku?: string;
  category?: string;
  brand?: string;
  minPrice?: number;
  maxPrice?: number;
  featured?: boolean;
  inStock?: boolean;
  prescriptionRequired?: boolean;
  sortBy?: "newest" | "price_asc" | "price_desc";
}

export class ProductService {
  constructor(private readonly repository: ProductRepositoryInterface) {}

  async createProduct(data: CreateProductInput): Promise<ProductDTO> {
    const category = await this.repository.findCategoryById(data.categoryId);

    if (!category) {
      throw new ApiError(404, "Category not found", ErrorCodes.CATEGORY_NOT_FOUND);
    }

    const brand = await this.repository.findBrandById(data.brandId);

    if (!brand) {
      throw new ApiError(404, "Brand not found", ErrorCodes.BRAND_NOT_FOUND);
    }

    const slug = slugify(data.name, {
      lower: true,
      strict: true,
    });

    const existingProduct = await this.repository.findBySlug(slug);

    if (existingProduct) {
      throw new ApiError(409, "Product already exists", ErrorCodes.PRODUCT_ALREADY_EXISTS);
    }

    let sku = data.sku?.trim();

    if (!sku) {
      sku = this.generateSku();
    }

    const existingSku = await this.repository.findBySku(sku);

    if (existingSku) {
      throw new ApiError(409, "Product SKU already exists", ErrorCodes.PRODUCT_ALREADY_EXISTS);
    }

    const product = await this.repository.create({
      data: {
        name: data.name,
        slug,
        sku,
        description: data.description ?? null,
        ingredients: data.ingredients ?? null,
        usageInstructions: data.usageInstructions ?? null,
        warnings: data.warnings ?? null,
        price: data.price,
        salePrice: data.salePrice ?? null,
        featured: data.featured ?? false,
        prescriptionRequired: data.prescriptionRequired ?? false,
        category: { connect: { id: data.categoryId } },
        brand: { connect: { id: data.brandId } },
        images: {
          create: data.images?.map((image) => ({
            imageUrl: image.imageUrl,
          })) ?? [],
        },
      },
    });

    return mapProductToDTO(product);
  }

  async getProducts(query: ProductQuery) {
    const page = Number(query.page) || 1;
    const limit = Number(query.limit) || 20;
    const pagination = getPagination(page, limit);

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

    if (query.featured) {
      where.featured = true;
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

    if (query.sortBy === "price_asc") {
      orderBy = { price: "asc" };
    } else if (query.sortBy === "price_desc") {
      orderBy = { price: "desc" };
    }

    const [products, total] = await Promise.all([
      this.repository.findMany({
        where,
        include: { category: true, brand: true, images: true, inventory: true },
        orderBy,
        skip: pagination.skip,
        take: pagination.take,
      }),
      this.repository.count({ where }),
    ]);

    return {
      products: mapProductsToDTOs(products),
      pagination: {
        page: pagination.page,
        limit: pagination.limit,
        total,
        pages: Math.ceil(total / pagination.limit),
      },
    };
  }

  async getProductBySlug(slug: string): Promise<ProductDTO> {
    const product = await this.repository.findBySlug(slug);

    if (!product) {
      throw new ApiError(404, "Product not found", ErrorCodes.PRODUCT_NOT_FOUND);
    }

    return mapProductToDTO(product);
  }

  generateSku(): string {
    const ts = Date.now().toString(36).toUpperCase();
    const rand = Math.random().toString(36).substring(2, 6).toUpperCase();
    return `SKU-${ts}-${rand}`;
  }

  async uploadProductImage(file: Express.Multer.File) {
    const uploadedFile = {
      buffer: file.buffer,
      originalname: file.originalname,
      mimetype: file.mimetype,
      size: file.size,
    };

    return storageService.upload(uploadedFile);
  }
}

const productRepository = new (await import("../infrastructure/prisma-product.repository.js")).PrismaProductRepository();

export const productService = new ProductService(productRepository);
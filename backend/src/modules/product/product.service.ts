import slugify from "slugify";

import { prisma } from "../../prisma/prisma.js";
import { ApiError } from "../../shared/ApiError.js";
import { getPagination } from "../../shared/pagination.js";
import { storageService } from "../../services/storage/index.js";
import { ErrorCodes, HttpStatus } from "@nursenourish/shared";

import type { ProductQuery } from "./product.types.js";
import type { CreateProductInput } from "./product.validator.js";

export class ProductService {
  async createProduct(data: CreateProductInput) {
    const category =
      await prisma.category.findUnique({
        where: {
          id: data.categoryId,
        },
      });

    if (!category) {
      throw new ApiError(
        HttpStatus.NOT_FOUND,
        ErrorCodes.CATEGORY_NOT_FOUND,
        "Category not found"
      );
    }

    const brand =
      await prisma.brand.findUnique({
        where: {
          id: data.brandId,
        },
      });

    if (!brand) {
      throw new ApiError(
        HttpStatus.NOT_FOUND,
        ErrorCodes.BRAND_NOT_FOUND,
        "Brand not found"
      );
    }

    const slug = slugify(data.name, {
      lower: true,
      strict: true,
    });

    const existingProduct =
      await prisma.product.findUnique({
        where: {
          slug,
        },
      });

    if (existingProduct) {
      throw new ApiError(
        HttpStatus.CONFLICT,
        ErrorCodes.PRODUCT_ALREADY_EXISTS,
        "Product already exists"
      );
    }

    let sku = data.sku?.trim();

    if (!sku) {
      sku = this.generateSku();
    }

    const existingSku = await prisma.product.findUnique({
      where: {
        sku,
      },
    });

    if (existingSku) {
      throw new ApiError(
        HttpStatus.CONFLICT,
        ErrorCodes.BAD_REQUEST,
        "Product SKU already exists"
      );
    }

    return prisma.product.create({
      data: {
        name: data.name,
        slug,
        sku,

        description: data.description ?? null,

        ingredients: data.ingredients ?? null,

        usageInstructions:
          data.usageInstructions ?? null,

        warnings: data.warnings ?? null,

        price: data.price,

        salePrice: data.salePrice ?? null,

        featured:
          data.featured ?? false,

        prescriptionRequired:
          data.prescriptionRequired ??
          false,

        categoryId: data.categoryId,

        brandId: data.brandId,

        images: {
          create:
            data.images?.map(
              (image) => ({
                imageUrl:
                  image.imageUrl,
              })
            ) ?? [],
        },
      },

      include: {
        category: true,
        brand: true,
        images: true,
      },
    });
  }

  async getProducts(query: ProductQuery) {
    const page =
      Number(query.page) || 1;

    const limit =
      Number(query.limit) || 20;

    const pagination =
      getPagination(page, limit);

    const where: any = {};

    if (query.search) {
      where.OR = [
        {
          name: {
            contains: query.search,
            mode: "insensitive",
          },
        },
        {
          brand: {
            name: {
              contains: query.search,
              mode: "insensitive",
            },
          },
        },
        {
          category: {
            name: {
              contains: query.search,
              mode: "insensitive",
            },
          },
        },
      ];
    }

    if (query.sku) {
      where.sku = {
        contains: query.sku,
        mode: "insensitive",
      };
    }

    if (query.featured) {
      where.featured = true;
    }

    if (query.category) {
      where.category = {
        slug: query.category,
      };
    }

    if (query.brand) {
      where.brand = {
        slug: query.brand,
      };
    }

    if (query.minPrice !== undefined || query.maxPrice !== undefined) {
      where.price = {};

      if (query.minPrice !== undefined) {
        where.price.gte = query.minPrice;
      }

      if (query.maxPrice !== undefined) {
        where.price.lte = query.maxPrice;
      }
    }

    if (query.inStock) {
      where.inventory = {
        quantity: {
          gt: 0,
        },
      };
    }

    if (query.prescriptionRequired !== undefined) {
      where.prescriptionRequired = query.prescriptionRequired;
    }

    let orderBy: any = {
      createdAt: "desc",
    };

    if (query.sortBy === "price_asc") {
      orderBy = {
        price: "asc",
      };
    } else if (query.sortBy === "price_desc") {
      orderBy = {
        price: "desc",
      };
    }

    const [products, total] =
      await Promise.all([
        prisma.product.findMany({
          where,

          include: {
            category: true,
            brand: true,
            images: true,
            inventory: true,
          },

          orderBy,

          skip: pagination.skip,
          take: pagination.take,
        }),

        prisma.product.count({
          where,
        }),
      ]);

    return {
      products,

      pagination: {
        page: pagination.page,
        limit: pagination.limit,
        total,
        pages: Math.ceil(
          total / pagination.limit
        ),
      },
    };
  }

  async getProductBySlug(
    slug: string
  ) {
    const product =
      await prisma.product.findUnique({
        where: {
          slug,
        },

        include: {
          category: true,
          brand: true,
          images: true,
          inventory: true,
        },
      });

    if (!product) {
      throw new ApiError(
        HttpStatus.NOT_FOUND,
        ErrorCodes.PRODUCT_NOT_FOUND,
        "Product not found"
      );
    }

    return product;
  }

  generateSku() {
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

export const productService =
  new ProductService();

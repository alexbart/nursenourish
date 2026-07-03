import slugify from "slugify";

import { prisma } from "../../prisma/prisma.js";
import { ApiError } from "../../shared/ApiError.js";
import { productRepository } from "./product.repository.js";
import { toProductDto } from "./product.mapper.js";
import { storageService } from "../../services/storage/index.js";
import { ErrorCodes, HttpStatus } from "@nursenourish/shared";

import type { ProductQuery } from "./product.types.js";
import type { CreateProductInput } from "./product.validator.js";
import type { ProductResponseDto } from "@nursenourish/shared/dto/product.dto.js";

export class ProductService {
  async createProduct(data: CreateProductInput): Promise<ProductResponseDto> {
    return prisma.$transaction(async (tx) => {
      const category = await tx.category.findUnique({
        where: { id: data.categoryId },
      });

      if (!category) {
        throw new ApiError(
          HttpStatus.NOT_FOUND,
          ErrorCodes.CATEGORY_NOT_FOUND,
          "Category not found"
        );
      }

      const brand = await tx.brand.findUnique({
        where: { id: data.brandId },
      });

      if (!brand) {
        throw new ApiError(
          HttpStatus.NOT_FOUND,
          ErrorCodes.BRAND_NOT_FOUND,
          "Brand not found"
        );
      }

      const slug = slugify(data.name, { lower: true, strict: true });

      const existingProduct = await tx.product.findUnique({ where: { slug } });
      if (existingProduct) {
        throw new ApiError(
          HttpStatus.CONFLICT,
          ErrorCodes.PRODUCT_ALREADY_EXISTS,
          "Product already exists"
        );
      }

      let sku = data.sku?.trim() ?? this.generateSku();

      const existingSku = await tx.product.findUnique({ where: { sku } });
      if (existingSku) {
        throw new ApiError(
          HttpStatus.CONFLICT,
          ErrorCodes.BAD_REQUEST,
          "Product SKU already exists"
        );
      }

      const product = await tx.product.create({
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
          categoryId: data.categoryId,
          brandId: data.brandId,
          images: {
            create: data.images?.map((image) => ({ imageUrl: image.imageUrl })) ?? [],
          },
        },
        include: { category: true, brand: true, images: true, inventory: true },
      });

      await tx.inventory.create({
        data: { productId: product.id, quantity: 0 },
      });

      return toProductDto(product);
    });
  }

  async getProducts(query: ProductQuery) {
    const result = await productRepository.findMany(query);
    return {
      products: result.products.map(toProductDto),
      pagination: result.pagination,
    };
  }

  async getProductBySlug(slug: string): Promise<ProductResponseDto> {
    const product = await productRepository.findBySlug(slug);
    if (!product) {
      throw new ApiError(
        HttpStatus.NOT_FOUND,
        ErrorCodes.PRODUCT_NOT_FOUND,
        "Product not found"
      );
    }
    return toProductDto(product);
  }

  async uploadProductImage(file: Express.Multer.File) {
    return storageService.upload(file);
  }

  private generateSku(): string {
    const ts = Date.now().toString(36).toUpperCase();
    const rand = Math.random().toString(36).substring(2, 6).toUpperCase();
    return `SKU-${ts}-${rand}`;
  }
}

export const productService = new ProductService();
import { prisma } from "../../prisma/prisma.js";
import { productRepository, ProductSearchCriteria } from "./product.repository.js";
import { toProductDto } from "./product.mapper.js";
import { storageService } from "../../services/storage/index.js";
import { ApiError } from "../../shared/ApiError.js";
import { ErrorCodes, HttpStatus } from "@nursenourish/shared";
import type { CreateProductInput } from "./product.validator.js";
import type { ProductResponseDto } from "@nursenourish/shared/dto/product.dto.js";

export class ProductService {
  async create(data: CreateProductInput): Promise<ProductResponseDto> {
    return prisma.$transaction(async (tx) => {
      const category = await tx.category.findUnique({
        where: { id: data.categoryId },
      });

      if (!category) {
        throw new ApiError(
          HttpStatus.NOT_FOUND,
          ErrorCodes.CATEGORY_NOT_FOUND,
          "Category not found."
        );
      }

      const brand = await tx.brand.findUnique({
        where: { id: data.brandId },
      });

      if (!brand) {
        throw new ApiError(
          HttpStatus.NOT_FOUND,
          ErrorCodes.BRAND_NOT_FOUND,
          "Brand not found."
        );
      }

      if (data.sku) {
        const existingSku = await tx.product.findUnique({
          where: { sku: data.sku.trim() },
        });
        if (existingSku) {
          throw new ApiError(
            HttpStatus.CONFLICT,
            ErrorCodes.BAD_REQUEST,
            "Product SKU already exists."
          );
        }
      }

      const product = await productRepository.create(data, tx);
      await tx.inventory.create({
        data: { productId: product.id, quantity: 0, reservedQuantity: 0 },
      });

      return toProductDto(product);
    });
  }

  async search(criteria: ProductSearchCriteria) {
    const result = await productRepository.search(criteria);
    return {
      products: result.products.map(toProductDto),
      pagination: result.pagination,
    };
  }

  async findBySlug(slug: string): Promise<ProductResponseDto> {
    const product = await productRepository.findBySlug(slug);
    if (!product) {
      throw new ApiError(
        HttpStatus.NOT_FOUND,
        ErrorCodes.PRODUCT_NOT_FOUND,
        "Product not found."
      );
    }
    return toProductDto(product);
  }

  async getRelated(productId: string, categoryId: string): Promise<ProductResponseDto[]> {
    const products = await prisma.product.findMany({
      where: {
        categoryId,
        id: { not: productId },
        status: "ACTIVE",
      },
      include: { category: true, brand: true, images: true, inventory: true },
      take: 4,
    });
    return products.map(toProductDto);
  }

  async update(id: string, data: Partial<CreateProductInput>): Promise<ProductResponseDto> {
    const product = await productRepository.findById(id);
    if (!product) {
      throw new ApiError(
        HttpStatus.NOT_FOUND,
        ErrorCodes.PRODUCT_NOT_FOUND,
        "Product not found."
      );
    }

    const updated = await productRepository.update(id, data);
    return toProductDto(updated);
  }

  async delete(id: string): Promise<void> {
    const product = await productRepository.findById(id);
    if (!product) {
      throw new ApiError(
        HttpStatus.NOT_FOUND,
        ErrorCodes.PRODUCT_NOT_FOUND,
        "Product not found."
      );
    }
    await productRepository.delete(id);
  }

  async uploadImage(file: Express.Multer.File) {
    return storageService.upload(file);
  }
}

export const productService = new ProductService();
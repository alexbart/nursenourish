import slugify from "slugify";

import { prisma } from "../../prisma/prisma.js";
import { ApiError } from "../../shared/ApiError.js";
import { ErrorCodes, HttpStatus } from "@nursenourish/shared";
import type { CreateCategoryInput } from "./category.validator.js";

export class CategoryService {
  async createCategory(data: CreateCategoryInput) {
    const slug = slugify(data.name, {
      lower: true,
      strict: true,
    });

    const existingCategory =
      await prisma.category.findUnique({
        where: {
          slug,
        },
      });

    if (existingCategory) {
      throw new ApiError(
        HttpStatus.CONFLICT,
        ErrorCodes.CATEGORY_ALREADY_EXISTS,
        "Category already exists"
      );
    }

    return prisma.category.create({
      data: {
        name: data.name,
        slug,
        description: data.description ?? null,
      },
    });
  }

  async getAllCategories() {
    return prisma.category.findMany({
      orderBy: {
        createdAt: "desc",
      },
    });
  }

  async getCategoryById(id: string) {
    const category =
      await prisma.category.findUnique({
        where: {
          id,
        },
      });

    if (!category) {
      throw new ApiError(
        HttpStatus.NOT_FOUND,
        ErrorCodes.CATEGORY_NOT_FOUND,
        "Category not found"
      );
    }

    return category;
  }

  async deleteCategory(id: string) {
    const category =
      await prisma.category.findUnique({
        where: {
          id,
        },
      });

    if (!category) {
      throw new ApiError(
        HttpStatus.NOT_FOUND,
        ErrorCodes.CATEGORY_NOT_FOUND,
        "Category not found"
      );
    }

    await prisma.category.delete({
      where: {
        id,
      },
    });

    return true;
  }
}

export const categoryService =
  new CategoryService();
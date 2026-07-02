import slugify from "slugify";

import { ApiError } from "../../../shared/ApiError.js";
import { ErrorCodes } from "@nursenourish/shared";
import type { CategoryRepositoryInterface } from "../domain/category.repository.interface.js";
import type { CategoryDTO } from "@nursenourish/shared/types";
import { mapCategoryToDTO, mapCategoriesToDTOs } from "@nursenourish/shared/dto";

export class CategoryService {
  constructor(private readonly repository: CategoryRepositoryInterface) {}

  async createCategory(data: { name: string; description?: string | null }): Promise<CategoryDTO> {
    const slug = slugify(data.name, {
      lower: true,
      strict: true,
    });

    const existingCategory = await this.repository.findBySlug(slug);

    if (existingCategory) {
      throw new ApiError(409, "Category already exists", ErrorCodes.CATEGORY_ALREADY_EXISTS);
    }

    const category = await this.repository.create({
      name: data.name,
      slug,
      description: data.description,
    });

    return mapCategoryToDTO(category);
  }

  async getAllCategories(): Promise<CategoryDTO[]> {
    const categories = await this.repository.findMany({
      orderBy: {
        createdAt: "desc",
      },
    });

    return mapCategoriesToDTOs(categories);
  }

  async getCategoryById(id: string): Promise<CategoryDTO> {
    const category = await this.repository.findById(id);

    if (!category) {
      throw new ApiError(404, "Category not found", ErrorCodes.CATEGORY_NOT_FOUND);
    }

    return mapCategoryToDTO(category);
  }

  async deleteCategory(id: string): Promise<void> {
    const category = await this.repository.findById(id);

    if (!category) {
      throw new ApiError(404, "Category not found", ErrorCodes.CATEGORY_NOT_FOUND);
    }

    await this.repository.delete(id);
  }
}
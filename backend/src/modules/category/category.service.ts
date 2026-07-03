import { categoryRepository } from "./category.repository.js";
import { toCategoryDto } from "./category.mapper.js";
import { ApiError } from "../../shared/ApiError.js";
import { ErrorCodes, HttpStatus } from "@nursenourish/shared";
import type { CreateCategoryInput, UpdateCategoryInput } from "./category.validator.js";
import type { CategoryResponseDto } from "@nursenourish/shared/dto/category.dto.js";

export class CategoryService {
  async create(data: CreateCategoryInput): Promise<CategoryResponseDto> {
    const slug = this.generateSlug(data.name);
    
    const exists = await categoryRepository.existsBySlug(slug);
    if (exists) {
      throw new ApiError(
        HttpStatus.CONFLICT,
        ErrorCodes.CATEGORY_ALREADY_EXISTS,
        "Category already exists."
      );
    }

    const category = await categoryRepository.create({
      name: data.name,
      description: data.description,
    });

    return toCategoryDto(category);
  }

  async findAll() {
    const categories = await categoryRepository.findAll();
    return categories.map(toCategoryDto);
  }

  async findById(id: string): Promise<CategoryResponseDto> {
    const category = await categoryRepository.findById(id);

    if (!category) {
      throw new ApiError(
        HttpStatus.NOT_FOUND,
        ErrorCodes.CATEGORY_NOT_FOUND,
        "Category not found."
      );
    }

    return toCategoryDto(category);
  }

  async findBySlug(slug: string): Promise<CategoryResponseDto> {
    const category = await categoryRepository.findBySlug(slug);

    if (!category) {
      throw new ApiError(
        HttpStatus.NOT_FOUND,
        ErrorCodes.CATEGORY_NOT_FOUND,
        "Category not found."
      );
    }

    return toCategoryDto(category);
  }

  async update(id: string, data: UpdateCategoryInput): Promise<CategoryResponseDto> {
    const category = await categoryRepository.findById(id);

    if (!category) {
      throw new ApiError(
        HttpStatus.NOT_FOUND,
        ErrorCodes.CATEGORY_NOT_FOUND,
        "Category not found."
      );
    }

    if (data.name) {
      const slug = this.generateSlug(data.name);
      const exists = await categoryRepository.existsBySlug(slug);
      if (exists && slug !== category.slug) {
        throw new ApiError(
          HttpStatus.CONFLICT,
          ErrorCodes.CATEGORY_ALREADY_EXISTS,
          "Category already exists."
        );
      }
    }

    const updated = await categoryRepository.update(id, data);
    return toCategoryDto(updated);
  }

  async delete(id: string): Promise<void> {
    const category = await categoryRepository.findById(id);

    if (!category) {
      throw new ApiError(
        HttpStatus.NOT_FOUND,
        ErrorCodes.CATEGORY_NOT_FOUND,
        "Category not found."
      );
    }

    await categoryRepository.delete(id);
  }

  private generateSlug(name: string): string {
    return name.toLowerCase().replace(/\s+/g, "-").replace(/[^a-z0-9-]/g, "");
  }
}

export const categoryService = new CategoryService();
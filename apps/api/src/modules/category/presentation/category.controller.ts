import type { Request, Response } from "express";

import { asyncHandler } from "../../../shared/asyncHandler.js";
import { CategoryService } from "../application/category.service.js";
import { PrismaCategoryRepository } from "../infrastructure/prisma-category.repository.js";

const categoryRepository = new PrismaCategoryRepository();
const categoryService = new CategoryService(categoryRepository);

export const createCategory = asyncHandler(async (req: Request, res: Response) => {
  const category = await categoryService.createCategory(req.body);
  res.status(201).json({
    message: "Category created.",
    data: category,
  });
});

export const getCategories = asyncHandler(async (_req: Request, res: Response) => {
  const categories = await categoryService.getAllCategories();
  res.status(200).json({ data: categories });
});

export const getCategoryById = asyncHandler(async (req: Request, res: Response) => {
  const id = req.params.id;
  if (!id || Array.isArray(id)) {
    throw new Error("Invalid category id");
  }

  const category = await categoryService.getCategoryById(id);
  res.status(200).json({ data: category });
});

export const deleteCategory = asyncHandler(async (req: Request, res: Response) => {
  const id = req.params.id;
  if (!id || Array.isArray(id)) {
    throw new Error("Invalid category id");
  }

  await categoryService.deleteCategory(id);
  res.status(204).send();
});

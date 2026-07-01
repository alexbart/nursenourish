import type { Request, Response } from "express";

import { asyncHandler } from "../../shared/asyncHandler.js";
import { apiResponse } from "../../shared/apiResponse.js";

import { categoryService } from "./category.service.js";
import { createCategorySchema } from "./category.validator.js";

export const createCategory =
  asyncHandler(async (req, res) => {
    const validatedData =
      createCategorySchema.parse(req.body);

    const category =
      await categoryService.createCategory(
        validatedData
      );

    res.status(201).json(
      apiResponse(
        "Category created successfully",
        category
      )
    );
  });

export const getCategories =
  asyncHandler(async (_req, res) => {
    const categories =
      await categoryService.getAllCategories();

    res.status(200).json(
      apiResponse(
        "Categories fetched successfully",
        categories
      )
    );
  });

export const getCategoryById =
  asyncHandler(async (req, res) => {
    const id = req.params.id;
    if (!id || Array.isArray(id)) {
      throw new Error("Invalid category id");
    }

    const category =
      await categoryService.getCategoryById(id);

    res.status(200).json(
      apiResponse(
        "Category fetched successfully",
        category
      )
    );
  });

export const deleteCategory =
  asyncHandler(async (req, res) => {
    const id = req.params.id;
    if (!id || Array.isArray(id)) {
      throw new Error("Invalid category id");
    }

    await categoryService.deleteCategory(id);

    res.status(200).json(
      apiResponse(
        "Category deleted successfully"
      )
    );
  });
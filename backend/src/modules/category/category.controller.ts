import type { Request, Response } from "express";

import { asyncHandler } from "../../shared/asyncHandler.js";
import { HttpStatus } from "@nursenourish/shared";

import { categoryService } from "./category.service.js";
import { createCategorySchema, updateCategorySchema } from "./category.validator.js";

export const create = asyncHandler(async (req, res) => {
  const validatedData = createCategorySchema.parse(req.body);
  const category = await categoryService.create(validatedData);

  res.status(HttpStatus.CREATED).json({
    data: category,
  });
});

export const getAll = asyncHandler(async (_req, res) => {
  const categories = await categoryService.findAll();

  res.status(HttpStatus.OK).json({
    data: categories,
  });
});

export const getOne = asyncHandler(async (req, res) => {
  const id = req.params.id;

  if (!id || Array.isArray(id)) {
    throw new Error("Invalid category id");
  }

  const category = await categoryService.findById(id);

  res.status(HttpStatus.OK).json({
    data: category,
  });
});

export const getBySlug = asyncHandler(async (req, res) => {
  const slug = req.params.slug;

  if (!slug || Array.isArray(slug)) {
    throw new Error("Invalid category slug");
  }

  const category = await categoryService.findBySlug(slug);

  res.status(HttpStatus.OK).json({
    data: category,
  });
});

export const update = asyncHandler(async (req, res) => {
  const id = req.params.id;

  if (!id || Array.isArray(id)) {
    throw new Error("Invalid category id");
  }

  const validatedData = updateCategorySchema.parse(req.body);
  const category = await categoryService.update(id, validatedData);

  res.status(HttpStatus.OK).json({
    data: category,
  });
});

export const remove = asyncHandler(async (req, res) => {
  const id = req.params.id;

  if (!id || Array.isArray(id)) {
    throw new Error("Invalid category id");
  }

  await categoryService.delete(id);

  res.status(HttpStatus.OK).json({
    message: "Category deleted successfully",
  });
});
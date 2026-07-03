import type { Request, Response } from "express";

import { asyncHandler } from "../../shared/asyncHandler.js";
import { HttpStatus } from "@nursenourish/shared";

import { brandService } from "./brand.service.js";
import { createBrandSchema, updateBrandSchema } from "./brand.validator.js";

export const create = asyncHandler(async (req, res) => {
  const validatedData = createBrandSchema.parse(req.body);
  const brand = await brandService.create(validatedData);

  res.status(HttpStatus.CREATED).json({
    data: brand,
  });
});

export const getAll = asyncHandler(async (_req, res) => {
  const brands = await brandService.findAll();

  res.status(HttpStatus.OK).json({
    data: brands,
  });
});

export const getOne = asyncHandler(async (req, res) => {
  const id = req.params.id;

  if (!id || Array.isArray(id)) {
    throw new Error("Invalid brand id");
  }

  const brand = await brandService.findById(id);

  res.status(HttpStatus.OK).json({
    data: brand,
  });
});

export const update = asyncHandler(async (req, res) => {
  const id = req.params.id;

  if (!id || Array.isArray(id)) {
    throw new Error("Invalid brand id");
  }

  const validatedData = updateBrandSchema.parse(req.body);
  const brand = await brandService.update(id, validatedData);

  res.status(HttpStatus.OK).json({
    data: brand,
  });
});

export const remove = asyncHandler(async (req, res) => {
  const id = req.params.id;

  if (!id || Array.isArray(id)) {
    throw new Error("Invalid brand id");
  }

  await brandService.delete(id);

  res.status(HttpStatus.OK).json({
    message: "Brand deleted successfully",
  });
});
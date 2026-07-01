import type { Request, Response } from "express";

import { asyncHandler } from "../../shared/asyncHandler.js";
import { apiResponse } from "../../shared/apiResponse.js";

import { brandService } from "./brand.service.js";
import { createBrandSchema } from "./brand.validator.js";

export const createBrand = asyncHandler(async (req, res) => {
  const validatedData = createBrandSchema.parse(req.body);

  const brand = await brandService.createBrand(validatedData);

  res.status(201).json(apiResponse("Brand created successfully", brand));
});

export const getBrands = asyncHandler(async (_req, res) => {
  const brands = await brandService.getAllBrands();

  res.status(200).json(apiResponse("Brands fetched successfully", brands));
});

export const getBrandById = asyncHandler(async (req, res) => {
  const id = req.params.id;
  if (!id || Array.isArray(id)) {
    throw new Error("Invalid brand id");
  }

  const brand = await brandService.getBrandById(id);

  res.status(200).json(apiResponse("Brand fetched successfully", brand));
});

export const deleteBrand = asyncHandler(async (req, res) => {
  const id = req.params.id;
  if (!id || Array.isArray(id)) {
    throw new Error("Invalid brand id");
  }

  await brandService.deleteBrand(id);

  res.status(200).json(apiResponse("Brand deleted successfully"));
});

import type { Request, Response } from "express";

import { asyncHandler } from "../../../shared/asyncHandler.js";
import { BrandService } from "../application/brand.service.js";
import { PrismaBrandRepository } from "../infrastructure/prisma-brand.repository.js";

const brandRepository = new PrismaBrandRepository();
const brandService = new BrandService(brandRepository);

export const createBrand = asyncHandler(async (req: Request, res: Response) => {
  const brand = await brandService.createBrand(req.body);
  res.status(201).json({
    message: "Brand created.",
    data: brand,
  });
});

export const getBrands = asyncHandler(async (_req: Request, res: Response) => {
  const brands = await brandService.getAllBrands();
  res.status(200).json({ data: brands });
});

export const getBrandById = asyncHandler(async (req: Request, res: Response) => {
  const id = req.params.id;
  if (!id || Array.isArray(id)) {
    throw new Error("Invalid brand id");
  }

  const brand = await brandService.getBrandById(id);
  res.status(200).json({ data: brand });
});

export const deleteBrand = asyncHandler(async (req: Request, res: Response) => {
  const id = req.params.id;
  if (!id || Array.isArray(id)) {
    throw new Error("Invalid brand id");
  }

  await brandService.deleteBrand(id);
  res.status(204).send();
});
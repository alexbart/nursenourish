import type { Request, Response } from "express";

import { asyncHandler } from "../../shared/asyncHandler.js";
import { HttpStatus } from "@nursenourish/shared";

import { productService } from "./product.service.js";
import { createProductSchema } from "./product.validator.js";
import type { ProductSearchCriteria } from "./product.repository.js";

export const create = asyncHandler(async (req, res) => {
  const validatedData = createProductSchema.parse(req.body);
  const product = await productService.create(validatedData);

  res.status(HttpStatus.CREATED).json({
    data: product,
  });
});

export const search = asyncHandler(async (req, res) => {
  const criteria: ProductSearchCriteria = req.query as any;
  const result = await productService.search(criteria);

  res.status(HttpStatus.OK).json({
    data: result.products,
    pagination: result.pagination,
  });
});

export const getOne = asyncHandler(async (req, res) => {
  const slug = req.params.slug;

  if (!slug || Array.isArray(slug)) {
    throw new Error("Invalid product slug");
  }

  const product = await productService.findBySlug(slug);

  res.status(HttpStatus.OK).json({
    data: product,
  });
});

export const update = asyncHandler(async (req, res) => {
  const id = req.params.id;

  if (!id || Array.isArray(id)) {
    throw new Error("Invalid product id");
  }

  const validatedData = createProductSchema.partial().parse(req.body);
  const product = await productService.update(id, validatedData);

  res.status(HttpStatus.OK).json({
    data: product,
  });
});

export const remove = asyncHandler(async (req, res) => {
  const id = req.params.id;

  if (!id || Array.isArray(id)) {
    throw new Error("Invalid product id");
  }

  await productService.delete(id);

  res.status(HttpStatus.NO_CONTENT).send();
});

import multer from "multer";
const storage = multer.memoryStorage();
export const uploadImageMiddleware = multer({ storage }).single("image");

export const uploadImage = asyncHandler(async (req: Request, res: Response) => {
  const file = req.file;
  if (!file) {
    throw new Error("No image file provided");
  }

  const imageUrl = await productService.uploadImage(file);
  res.status(HttpStatus.OK).json({
    data: { imageUrl },
  });
});
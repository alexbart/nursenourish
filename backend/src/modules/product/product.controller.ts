import multer from "multer";
import type { Request, Response } from "express";

import { asyncHandler } from "../../shared/asyncHandler.js";
import { HttpStatus } from "@nursenourish/shared";

import { productService } from "./product.service.js";
import { createProductSchema } from "./product.validator.js";

export const createProduct = asyncHandler(async (req, res) => {
  const validated = createProductSchema.parse(req.body);
  const product = await productService.createProduct(validated);

  res.status(HttpStatus.CREATED).json({
    data: product,
  });
});

export const getProducts = asyncHandler(async (req, res) => {
  const products = await productService.getProducts(req.query as any);

  res.status(HttpStatus.OK).json({
    data: products.products,
    pagination: products.pagination,
  });
});

export const getProductBySlug = asyncHandler(async (req, res) => {
  const slug = req.params.slug;

  if (!slug || Array.isArray(slug)) {
    throw new Error("Invalid slug");
  }

  const product = await productService.getProductBySlug(slug);

  res.status(HttpStatus.OK).json({
    data: product,
  });
});

const storage = multer.memoryStorage();

export const uploadImageMiddleware = multer({ storage }).single("image");

export const uploadProductImage = asyncHandler(async (req: Request, res: Response) => {
  const file = req.file;

  if (!file) {
    throw new Error("No image file provided");
  }

  const imageUrl = await productService.uploadProductImage(file);

  res.status(HttpStatus.OK).json({
    data: { imageUrl },
  });
});
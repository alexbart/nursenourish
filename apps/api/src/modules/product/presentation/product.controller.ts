import type { Request, Response } from "express";

import { asyncHandler } from "../../../shared/asyncHandler.js";
import { productService } from "../application/product.service.js";

export const createProduct = asyncHandler(async (req: Request, res: Response) => {
  const product = await productService.createProduct(req.body);

  res.status(201).json({
    message: "Product created.",
    data: product,
  });
});

export const getProducts = asyncHandler(async (req: Request, res: Response) => {
  const result = await productService.getProducts(req.query as any);

  res.status(200).json({
    data: result.products,
    pagination: result.pagination,
  });
});

export const getProductBySlug = asyncHandler(async (req: Request, res: Response) => {
  const slug = req.params.slug;

  if (!slug || Array.isArray(slug)) {
    throw new Error("Invalid slug");
  }

  const product = await productService.getProductBySlug(slug);

  res.status(200).json({
    data: product,
  });
});

export const uploadProductImage = asyncHandler(async (req: Request, res: Response) => {
  const file = req.file;

  if (!file) {
    throw new Error("No image file provided");
  }

  const imageUrl = await productService.uploadProductImage(file);

  res.status(200).json({
    data: { imageUrl },
  });
});

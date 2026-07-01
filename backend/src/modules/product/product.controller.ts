import multer from "multer";
import type { Request, Response } from "express";

import { asyncHandler } from "../../shared/asyncHandler.js";
import { apiResponse } from "../../shared/apiResponse.js";

import { productService } from "./product.service.js";
import { createProductSchema } from "./product.validator.js";

export const createProduct =
  asyncHandler(async (req, res) => {
    const validated =
      createProductSchema.parse(
        req.body
      );

    const product =
      await productService.createProduct(
        validated
      );

    res.status(201).json(
      apiResponse(
        "Product created successfully",
        product
      )
    );
  });

export const getProducts =
  asyncHandler(async (req, res) => {
    const products =
      await productService.getProducts(
        req.query as any
      );

    res.status(200).json(
      apiResponse(
        "Products fetched successfully",
        products
      )
    );
  });

export const getProductBySlug =
  asyncHandler(async (req, res) => {
    const slug = req.params.slug;

    if (!slug || Array.isArray(slug)) {
      throw new Error("Invalid slug");
    }

    const product =
      await productService.getProductBySlug(
        slug
      );

    res.status(200).json(
      apiResponse(
        "Product fetched successfully",
        product
      )
    );
  });

const storage = multer.memoryStorage();

export const uploadImageMiddleware =
  multer({ storage }).single("image");

export const uploadProductImage =
  asyncHandler(async (req: Request, res: Response) => {
    const file = req.file;

    if (!file) {
      throw new Error("No image file provided");
    }

    const imageUrl =
      await productService.uploadProductImage(
        file
      );

    res.status(200).json(
      apiResponse(
        "Image uploaded successfully",
        { imageUrl }
      )
    );
  });

import { Router } from "express";

import {
  createProduct,
  getProductBySlug,
  getProducts,
  uploadProductImage,
  uploadImageMiddleware,
} from "./product.controller.js";

const router = Router();

router.post("/", createProduct);

router.get("/", getProducts);

router.get("/:slug", getProductBySlug);

router.post("/upload-image", uploadImageMiddleware, uploadProductImage);

export default router;

import { Router } from "express";
import multer from "multer";

import {
  createProduct,
  getProductBySlug,
  getProducts,
  uploadProductImage,
} from "./product.controller.js";

import { validate } from "../../../middlewares/validate.middleware.js";
import { createProductSchema } from "./product.validator.js";

const storage = multer.memoryStorage();
const uploadImageMiddleware = multer({ storage }).single("image");

const router = Router();

router.post("/", validate(createProductSchema), createProduct);
router.get("/", getProducts);
router.get("/:slug", getProductBySlug);
router.post("/upload-image", uploadImageMiddleware, uploadProductImage);

export default router;
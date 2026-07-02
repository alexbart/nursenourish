import { Router } from "express";

import {
  createBrand,
  getBrandById,
  getBrands,
  deleteBrand,
} from "./brand.controller.js";

import { validate } from "../../../middlewares/validate.middleware.js";
import { createBrandSchema } from "./brand.validator.js";

const router = Router();

router.post("/", validate(createBrandSchema), createBrand);
router.get("/", getBrands);
router.get("/:id", getBrandById);
router.delete("/:id", deleteBrand);

export default router;
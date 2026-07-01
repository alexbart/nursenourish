import { Router } from "express";

import {
  createBrand,
  deleteBrand,
  getBrands,
  getBrandById,
} from "./brand.controller.js";

const router = Router();

router.post("/", createBrand);

router.get("/", getBrands);

router.get("/:id", getBrandById);

router.delete("/:id", deleteBrand);

export default router;

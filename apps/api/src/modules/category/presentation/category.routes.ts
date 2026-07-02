import { Router } from "express";
import { validate } from "../../../middlewares/validate.middleware.js";

import {
  createCategory,
  deleteCategory,
  getCategories,
  getCategoryById,
} from "./category.controller.js";

import { createCategorySchema } from "./category.validator.js";

const router = Router();

router.post("/", validate(createCategorySchema), createCategory);
router.get("/", getCategories);
router.get("/:id", getCategoryById);
router.delete("/:id", deleteCategory);

export default router;
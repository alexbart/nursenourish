import { Router } from "express";

import {
  create,
  getAll,
  getOne,
  getBySlug,
  update,
  remove,
} from "./category.controller.js";

const router = Router();

router.post("/", create);

router.get("/", getAll);

router.get("/slug/:slug", getBySlug);

router.get("/:id", getOne);

router.patch("/:id", update);

router.delete("/:id", remove);

export default router;
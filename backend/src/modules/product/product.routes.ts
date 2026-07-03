import { Router } from "express";

import {
  create,
  search,
  getOne,
  update,
  remove,
  uploadImage,
  uploadImageMiddleware,
} from "./product.controller.js";

const router = Router();

router.post("/", create);

router.get("/", search);

router.get("/:slug", getOne);

router.patch("/:id", update);

router.delete("/:id", remove);

router.post("/upload-image", uploadImageMiddleware, uploadImage);

export default router;
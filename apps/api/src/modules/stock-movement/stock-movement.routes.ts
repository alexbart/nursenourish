import { Router } from "express";

import {
  createStockMovement,
  getStockMovements,
  getMovementsByProductId,
} from "./stock-movement.controller.js";

const router = Router();

router.post("/", createStockMovement);

router.get("/", getStockMovements);

router.get("/product/:productId", getMovementsByProductId);

export default router;

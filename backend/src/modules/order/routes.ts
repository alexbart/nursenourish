import { Router } from "express";
import { createOrder, getOrders, getOrder } from "./controller/order.controller.js";
import { authMiddleware } from "../../middlewares/auth.middleware.js";

const router = Router();

router.use(authMiddleware);
router.post("/", createOrder);
router.get("/", getOrders);
router.get("/:id", getOrder);

export default router;
import { Router } from "express";
import { initialize, verify, webhook } from "./controller/payment.controller.js";

const router = Router();

router.post("/initialize", initialize);
router.get("/verify/:reference", verify);
router.post("/webhook", webhook);

export default router;
import { Router } from "express";
import { deliveryController } from "./delivery.controller.js";

const router = Router();

router.post("/calculate", deliveryController.calculateFee);
router.post("/geocode", deliveryController.geocode);
router.post("/reverse-geocode", deliveryController.reverseGeocode);

export default router;

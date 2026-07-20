import { asyncHandler } from "../../shared/asyncHandler.js";
import { calculateDeliveryFee, geocodeAddress, reverseGeocode } from "./delivery.service.js";
import type { DeliveryFeeRequest, GeocodeRequest, GeocodeResponse } from "./delivery.service.js";

export class DeliveryController {
  calculateFee = asyncHandler(async (req: any, res: any) => {
    const { latitude, longitude } = req.body as DeliveryFeeRequest;

    if (typeof latitude !== "number" || typeof longitude !== "number") {
      res.status(400).json({ message: "Valid latitude and longitude are required" });
      return;
    }

    const subtotal = Number(req.query.subtotal || 0);
    const result = calculateDeliveryFee(latitude, longitude, subtotal);
    res.status(200).json(result);
  });

  geocode = asyncHandler(async (req: any, res: any) => {
    const { address } = req.body as GeocodeRequest;

    if (!address || typeof address !== "string") {
      res.status(400).json({ message: "Address is required" });
      return;
    }

    try {
      const result: GeocodeResponse = await geocodeAddress(address);
      res.status(200).json(result);
    } catch {
      res.status(404).json({ message: "Address not found" });
    }
  });

  reverseGeocode = asyncHandler(async (req: any, res: any) => {
    const { latitude, longitude } = req.body as { latitude: number; longitude: number };

    if (typeof latitude !== "number" || typeof longitude !== "number") {
      res.status(400).json({ message: "Valid latitude and longitude are required" });
      return;
    }

    try {
      const result: GeocodeResponse = await reverseGeocode(latitude, longitude);
      res.status(200).json(result);
    } catch {
      res.status(404).json({ message: "Location not found" });
    }
  });
}

export const deliveryController = new DeliveryController();


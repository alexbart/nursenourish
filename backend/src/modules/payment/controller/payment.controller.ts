import type { Request, Response } from "express";
import { asyncHandler } from "../../../shared/asyncHandler.js";
import { paymentService } from "../service/payment.service.js";
import { HttpStatus } from "@nursenourish/shared";

export const initialize = asyncHandler(async (req: Request, res: Response) => {
  const { orderId, email, amount } = req.body;
  const result = await paymentService.initialize(orderId, email, amount);
  res.status(HttpStatus.OK).json({ data: result });
});

export const verify = asyncHandler(async (req: Request, res: Response) => {
  const { reference } = req.params;
  const result = await paymentService.verify(reference);
  res.status(HttpStatus.OK).json({ data: result });
});

export const webhook = asyncHandler(async (req: Request, res: Response) => {
  const event = req.body;
  console.log("Paystack webhook:", event);

  res.status(HttpStatus.OK).json({ received: true });
});
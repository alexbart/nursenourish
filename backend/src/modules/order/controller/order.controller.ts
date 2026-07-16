import type { Request, Response } from "express";
import { asyncHandler } from "../../../shared/asyncHandler.js";
import { requireParam } from "../../../shared/routeParams.js";
import { HttpStatus } from "@nursenourish/shared";
import { orderService } from "../service/order.service.js";

export const createOrder = asyncHandler(async (req: Request, res: Response) => {
  const userId = req.user?.id;
  if (!userId) {
    res.status(401).json({ error: "Unauthorized" });
    return;
  }

  const order = await orderService.createOrder(userId, req.body);
  res.status(HttpStatus.CREATED).json({ data: order });
});

export const getOrders = asyncHandler(async (req: Request, res: Response) => {
  const userId = req.user?.id;
  if (!userId) {
    res.status(401).json({ error: "Unauthorized" });
    return;
  }

  const orders = await orderService.getOrders(userId);
  res.status(HttpStatus.OK).json({ data: orders });
});

export const getOrder = asyncHandler(async (req: Request, res: Response) => {
  const userId = req.user?.id;
  const orderId = requireParam(req.params.id);

  if (!userId) {
    res.status(401).json({ error: "Unauthorized" });
    return;
  }

  const order = await orderService.getOrder(orderId, userId);
  res.status(HttpStatus.OK).json({ data: order });
});

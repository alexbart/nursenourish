import type { Request, Response } from "express";

import { asyncHandler } from "../../shared/asyncHandler.js";
import { apiResponse } from "../../shared/apiResponse.js";

import { stockMovementService } from "./stock-movement.service.js";
import { createStockMovementSchema, getStockMovementsSchema } from "./stock-movement.validator.js";

export const createStockMovement =
  asyncHandler(async (req, res) => {
    const validated =
      createStockMovementSchema.parse(req.body);

    const movement =
      await stockMovementService.createStockMovement(validated);

    res.status(201).json(
      apiResponse(
        "Stock movement created successfully",
        movement
      )
    );
  });

export const getStockMovements =
  asyncHandler(async (req, res) => {
    const validated =
      getStockMovementsSchema.parse(req.query);

    const result =
      await stockMovementService.getStockMovements(validated);

    res.status(200).json(
      apiResponse(
        "Stock movements fetched successfully",
        result
      )
    );
  });

export const getMovementsByProductId =
  asyncHandler(async (req, res) => {
    const { productId } = req.params;

    if (!productId || Array.isArray(productId)) {
      throw new Error("Invalid product id");
    }

    const movements =
      await stockMovementService.getMovementsByProductId(
        productId
      );

    res.status(200).json(
      apiResponse(
        "Stock movements fetched successfully",
        movements
      )
    );
  });

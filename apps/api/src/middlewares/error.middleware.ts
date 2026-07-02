import type { NextFunction, Request, Response } from "express";
import { ZodError } from "zod";

import { ApiError } from "../shared/ApiError.js";
import { ErrorCodes } from "@nursenourish/shared";

export function errorMiddleware(
  error: Error,
  _req: Request,
  res: Response,
  _next: NextFunction
): void {
  if (error instanceof ZodError) {
    res.status(400).json({
      error: {
        code: ErrorCodes.VALIDATION_ERROR,
        message: "Validation failed",
        errors: error.issues.map((issue) => ({
          field: issue.path.join("."),
          message: issue.message,
        })),
      },
    });
    return;
  }

  if (error instanceof ApiError) {
    res.status(error.statusCode).json({
      error: {
        code: error.code,
        message: error.message,
      },
    });
    return;
  }

  res.status(500).json({
    error: {
      code: ErrorCodes.INTERNAL_ERROR,
      message: "Internal Server Error",
    },
  });
}
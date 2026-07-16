import type { NextFunction, Request, Response } from "express";
import { ZodError } from "zod";

import { ApiError } from "../shared/ApiError.js";
import { ErrorCodes, HttpStatus, type ApiErrorResponse } from "@nursenourish/shared";

export function errorHandler(
  err: unknown,
  req: Request,
  res: Response,
  _next: NextFunction
) {
  console.error(err);

  if (err instanceof ApiError) {
    const response: ApiErrorResponse = {
      error: {
        code: err.code,
        message: err.message,
        details: err.details,
      },
    };

    return res.status(err.statusCode).json(response);
  }

  if (err instanceof ZodError) {
    const response: ApiErrorResponse = {
      error: {
        code: ErrorCodes.VALIDATION_ERROR,
        message: "Validation failed.",
        details: err.issues.map(issue => ({
          field: issue.path.join("."),
          message: issue.message,
        })),
      },
    };

    return res.status(HttpStatus.UNPROCESSABLE_ENTITY).json(response);
  }

  const response: ApiErrorResponse = {
    error: {
      code: ErrorCodes.INTERNAL_SERVER_ERROR,
      message: "An unexpected error occurred.",
    },
  };

  return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json(response);
}
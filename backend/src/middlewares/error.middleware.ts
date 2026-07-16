import type { NextFunction, Request, Response } from "express";
import { ZodError } from "zod";

import { ApiError } from "../shared/ApiError.js";
import { ErrorCodes, HttpStatus, type ApiErrorResponse } from "@nursenourish/shared";

function getErrorMessage(err: unknown): string {
  if (err instanceof Error) return err.message;
  return "An unexpected error occurred.";
}

export function errorHandler(
  err: unknown,
  _req: Request,
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
        details: err.issues.map((issue) => ({
          field: issue.path.join("."),
          message: issue.message,
        })),
      },
    };

    return res.status(HttpStatus.UNPROCESSABLE_ENTITY).json(response);
  }

  // Surface the real message so Vercel runtime failures (DB/env) are diagnosable
  const message = getErrorMessage(err);
  const response: ApiErrorResponse = {
    error: {
      code: ErrorCodes.INTERNAL_SERVER_ERROR,
      message,
    },
  };

  return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json(response);
}

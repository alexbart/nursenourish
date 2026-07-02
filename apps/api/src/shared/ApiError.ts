import type { ErrorCode } from "@nursenourish/shared/types";
import { ErrorCodes } from "@nursenourish/shared";

export class ApiError extends Error {
  public readonly statusCode: number;
  public readonly code: ErrorCode;

  constructor(statusCode: number, message: string, code: ErrorCode = ErrorCodes.INTERNAL_ERROR) {
    super(message);

    this.statusCode = statusCode;
    this.code = code;

    Error.captureStackTrace(this, this.constructor);
  }
}
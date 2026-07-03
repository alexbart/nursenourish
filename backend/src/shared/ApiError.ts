import type { ErrorCode } from "@nursenourish/shared";

export class ApiError extends Error {
  constructor(
    public readonly statusCode: number,
    public readonly code: ErrorCode,
    message: string,
    public readonly details?: unknown
  ) {
    super(message);

    this.name = "ApiError";

    Error.captureStackTrace(this, this.constructor);
  }
}
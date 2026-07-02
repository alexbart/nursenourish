import type { NextFunction, Request, Response } from "express";
import { randomUUID } from "crypto";

export function requestIdMiddleware(
  req: Request,
  res: Response,
  next: NextFunction
): void {
  const requestId = randomUUID();
  res.setHeader("X-Request-ID", requestId);
  (req as any).requestId = requestId;
  next();
}
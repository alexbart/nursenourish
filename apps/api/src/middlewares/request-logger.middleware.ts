import type { NextFunction, Request, Response } from "express";

import { logger } from "../shared/logger.js";

export function requestLoggerMiddleware(
  req: Request,
  res: Response,
  next: NextFunction
): void {
  const start = Date.now();
  const requestId = (req as any).requestId ?? "unknown";

  res.on("finish", () => {
    const duration = Date.now() - start;
    logger.info({
      requestId,
      method: req.method,
      route: req.path,
      duration,
      status: res.statusCode,
    });
  });

  next();
}
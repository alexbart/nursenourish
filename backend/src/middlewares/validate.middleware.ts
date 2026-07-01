import type { ZodTypeAny, ZodType } from "zod";
import type { Request, Response, NextFunction } from "express";

type Schema<TOutput = unknown> = ZodType<TOutput, any, any>;

export const validate =
  <TOutput = unknown>(schema: Schema<TOutput>) =>
  (req: Request, _res: Response, next: NextFunction) => {
    req.body = schema.parse(req.body) as any;
    next();
  };

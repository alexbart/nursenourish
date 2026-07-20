import type { Request, Response } from "express";
import { asyncHandler } from "../../../shared/asyncHandler.js";
import { HttpStatus } from "@nursenourish/shared";
import { authService } from "../service/auth.service.js";
import { registerSchema } from "../validators/register.validator.js";
import { loginSchema } from "../validators/login.validator.js";

export const register = asyncHandler(async (req: Request, res: Response) => {
  const validatedData = registerSchema.parse(req.body);
  const result = await authService.register(validatedData);

  res.status(HttpStatus.CREATED).json({
    data: result,
  });
});

export const login = asyncHandler(async (req: Request, res: Response) => {
  const validatedData = loginSchema.parse(req.body);
  const result = await authService.login(validatedData);

  res.status(HttpStatus.OK).json({
    data: result,
  });
});

export const refresh = asyncHandler(async (req: Request, res: Response) => {
  const { refreshToken } = req.body;
  if (!refreshToken) {
    res.status(400).json({ error: "Refresh token required" });
    return;
  }

  const result = await authService.refresh(refreshToken);
  res.status(HttpStatus.OK).json({ data: result });
});

export const me = asyncHandler(async (req: Request, res: Response) => {
  const userId = req.user?.id;
  if (!userId) {
    res.status(401).json({ error: "Unauthorized" });
    return;
  }

  const result = await authService.getProfile(userId);
  res.status(HttpStatus.OK).json({ data: result });
});
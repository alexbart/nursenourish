import type { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET || "secret";

export function adminGuard(req: Request, res: Response, next: NextFunction) {
  const authHeader = req.headers.authorization;
  if (!authHeader?.startsWith("Bearer ")) {
    return res.status(401).json({ error: "Unauthorized" });
  }

  const token = authHeader.substring(7);
  try {
    const payload = jwt.verify(token, JWT_SECRET) as { userId: string; role: string };
    const allowed = ["SUPER_ADMIN", "MANAGER", "INVENTORY_MANAGER", "MARKETING_MANAGER"];
    if (!allowed.includes(payload.role)) {
      return res.status(403).json({ error: "Forbidden" });
    }
    (req as any).user = { id: payload.userId, role: payload.role };
    next();
  } catch {
    return res.status(401).json({ error: "Invalid token" });
  }
}

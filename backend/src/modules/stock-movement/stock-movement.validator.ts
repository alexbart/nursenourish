import { z } from "zod";

export const createStockMovementSchema = z.object({
  productId: z.string().uuid(),
  type: z.enum(["INITIAL", "PURCHASE", "SALE", "RETURN", "ADJUSTMENT", "DAMAGE"]),
  quantity: z.coerce.number().int(),
  reason: z.string().optional(),
  reference: z.string().optional(),
});

export const getStockMovementsSchema = z.object({
  page: z.coerce.number().positive().optional(),
  limit: z.coerce.number().positive().optional(),
  productId: z.string().uuid().optional(),
  type: z.enum(["INITIAL", "PURCHASE", "SALE", "RETURN", "ADJUSTMENT", "DAMAGE"]).optional(),
});

export type CreateStockMovementInput = z.infer<typeof createStockMovementSchema>;
export type GetStockMovementsQuery = z.infer<typeof getStockMovementsSchema>;

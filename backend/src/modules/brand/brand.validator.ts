import { z } from "zod";

export const createBrandSchema = z.object({
  name: z.string().min(2).max(100),
  description: z.string().optional(),
});

export const updateBrandSchema = z.object({
  name: z.string().min(2).max(100).optional(),
  description: z.string().optional(),
});

export type CreateBrandInput = z.infer<typeof createBrandSchema>;
export type UpdateBrandInput = z.infer<typeof updateBrandSchema>;
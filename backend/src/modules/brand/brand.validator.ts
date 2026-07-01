import { z } from "zod";

export const createBrandSchema = z.object({
  name: z
    .string()
    .min(2, "Brand name must be at least 2 characters")
    .max(100),

  description: z
    .string()
    .max(500)
    .optional(),
});

export type CreateBrandInput = z.infer<typeof createBrandSchema>;

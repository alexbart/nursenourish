export const ProductStatus = {
  DRAFT: "DRAFT",
  PUBLISHED: "PUBLISHED",
  ARCHIVED: "ARCHIVED",
  OUT_OF_STOCK: "OUT_OF_STOCK",
} as const;

export type ProductStatusType = (typeof ProductStatus)[keyof typeof ProductStatus];
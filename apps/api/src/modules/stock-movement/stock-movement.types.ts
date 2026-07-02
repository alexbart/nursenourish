export interface StockMovementQuery {
  page?: number | undefined;
  limit?: number | undefined;
  productId?: string | undefined;
  type?: "PURCHASE" | "SALE" | "ADJUSTMENT" | "RETURN" | "INITIAL" | "DAMAGE" | undefined;
}


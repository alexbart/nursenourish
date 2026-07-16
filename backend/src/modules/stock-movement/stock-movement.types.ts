export interface StockMovementQuery {
  page?: number | undefined;
  limit?: number | undefined;
  productId?: string | undefined;
  type?: "INITIAL" | "PURCHASE" | "SALE" | "ADJUSTMENT" | "RETURN" | "DAMAGE" | undefined;
}

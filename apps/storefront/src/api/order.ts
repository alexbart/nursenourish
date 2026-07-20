import { api } from "@/lib/api";

export interface CreateOrderPayload {
  items: { productId: string; name: string; price: number; quantity: number }[];
  subtotal: number;
  shippingAddress?: string;
  deliveryMethod: "PICKUP" | "DELIVERY";
  deliveryFee: number;
  latitude?: number;
  longitude?: number;
}

export const createOrder = (data: CreateOrderPayload) =>
  api.post("/orders", data);

export const getOrders = () => api.get("/orders");

export const getOrder = (id: string) => api.get(`/orders/${id}`);

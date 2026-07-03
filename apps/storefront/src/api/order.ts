import { api } from "@/lib/api";

export const createOrder = (data: { items: any[]; subtotal: number }) =>
  api.post("/orders", data);

export const getOrders = () => api.get("/orders");

export const getOrder = (id: string) => api.get(`/orders/${id}`);
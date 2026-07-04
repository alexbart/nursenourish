import { api } from "@/lib/api";

export const initializePayment = (data: { orderId: string; email: string; amount: number }) =>
  api.post("/payments/initialize", data);

export const verifyPayment = (reference: string) =>
  api.get(`/payments/verify/${reference}`);
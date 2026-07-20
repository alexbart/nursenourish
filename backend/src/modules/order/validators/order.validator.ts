export enum OrderStatus {
  PENDING = "PENDING",
  AWAITING_PAYMENT = "AWAITING_PAYMENT",
  PAID = "PAID",
  PROCESSING = "PROCESSING",
  SHIPPED = "SHIPPED",
  DELIVERED = "DELIVERED",
  CANCELLED = "CANCELLED",
}

export enum DeliveryMethod {
  PICKUP = "PICKUP",
  DELIVERY = "DELIVERY",
}

export interface OrderItem {
  productId: string;
  name: string;
  price: number;
  quantity: number;
}

export interface CreateOrderDto {
  items: OrderItem[];
  subtotal: number;
  shippingAddress?: string;
  deliveryMethod: DeliveryMethod;
  deliveryFee: number;
  latitude?: number;
  longitude?: number;
}

export interface OrderResponse {
  id: string;
  status: OrderStatus;
  subtotal: number;
  total: number;
  items: OrderItem[];
  shippingAddress?: string;
  deliveryMethod: DeliveryMethod;
  deliveryFee: number;
  latitude?: number;
  longitude?: number;
  createdAt: string;
}
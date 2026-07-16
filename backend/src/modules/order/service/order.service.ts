import { prisma } from "../../../prisma/prisma.js";
import type { CreateOrderDto } from "../validators/order.validator.js";

export class OrderService {
  async createOrder(userId: string, data: CreateOrderDto) {
    const total = data.subtotal;

    const order = await prisma.order.create({
      data: {
        userId,
        subtotal: data.subtotal,
        total,
        status: "PENDING",
        items: {
          create: data.items.map((item) => ({
            productId: item.productId,
            name: item.name,
            price: item.price,
            quantity: item.quantity,
          })),
        },
      },
    });

    return order;
  }

  async getOrders(userId: string) {
    return prisma.order.findMany({
      where: { userId },
      include: { items: true },
    });
  }

  async getOrder(id: string, userId: string) {
    return prisma.order.findFirst({
      where: { id, userId },
      include: { items: true, payment: true },
    });
  }
}

export const orderService = new OrderService();
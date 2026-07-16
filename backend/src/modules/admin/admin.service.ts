import { prisma } from "../../prisma/prisma.js";
import { importCatalog } from "../../scripts/import/importer.js";
import * as fs from "fs";

export class AdminService {
  // ── Dashboard ──────────────────────────────────────────────────────────────
  async getStats() {
    const [
      totalProducts,
      totalOrders,
      totalUsers,
      totalRevenue,
      recentOrders,
      lowStock,
      ordersByStatus,
      revenueByDay,
    ] = await Promise.all([
      prisma.product.count(),
      prisma.order.count(),
      prisma.user.count({ where: { role: "CUSTOMER" } }),
      prisma.order.aggregate({
        _sum: { total: true },
        where: { status: { in: ["PAID", "PROCESSING", "SHIPPED", "DELIVERED"] } },
      }),
      prisma.order.findMany({
        take: 5,
        orderBy: { createdAt: "desc" },
        include: { user: { select: { firstName: true, lastName: true, email: true } }, items: true },
      }),
      prisma.inventory.findMany({
        where: { quantity: { lte: 5 } },
        include: { product: { select: { id: true, name: true, sku: true } } },
        orderBy: { quantity: "asc" },
        take: 10,
      }),
      prisma.order.groupBy({
        by: ["status"],
        _count: { id: true },
      }),
      prisma.$queryRaw<{ day: string; revenue: number }[]>`
        SELECT DATE_TRUNC('day', "createdAt") as day, SUM(total)::float as revenue
        FROM orders
        WHERE "createdAt" >= NOW() - INTERVAL '30 days'
          AND status IN ('PAID','PROCESSING','SHIPPED','DELIVERED')
        GROUP BY day ORDER BY day ASC
      `,
    ]);

    return {
      totalProducts,
      totalOrders,
      totalUsers,
      totalRevenue: Number(totalRevenue._sum.total ?? 0),
      recentOrders,
      lowStock,
      ordersByStatus,
      revenueByDay,
    };
  }

  // ── Orders ─────────────────────────────────────────────────────────────────
  async getOrders(query: { page?: string; limit?: string; status?: string; search?: string }) {
    const page = Number(query.page) || 1;
    const limit = Number(query.limit) || 20;
    const skip = (page - 1) * limit;

    const where: any = {};
    if (query.status) where.status = query.status;
    if (query.search) {
      where.OR = [
        { user: { email: { contains: query.search, mode: "insensitive" } } },
        { user: { firstName: { contains: query.search, mode: "insensitive" } } },
      ];
    }

    const [orders, total] = await Promise.all([
      prisma.order.findMany({
        where,
        skip,
        take: limit,
        orderBy: { createdAt: "desc" },
        include: {
          user: { select: { id: true, firstName: true, lastName: true, email: true } },
          items: true,
          payment: true,
        },
      }),
      prisma.order.count({ where }),
    ]);

    return { orders, pagination: { page, limit, total, pages: Math.ceil(total / limit) } };
  }

  async updateOrderStatus(id: string, status: string) {
    return prisma.order.update({ where: { id }, data: { status: status as any } });
  }

  // ── Users ──────────────────────────────────────────────────────────────────
  async getUsers(query: { page?: string; limit?: string; role?: string; search?: string }) {
    const page = Number(query.page) || 1;
    const limit = Number(query.limit) || 20;
    const skip = (page - 1) * limit;

    const where: any = {};
    if (query.role) where.role = query.role;
    if (query.search) {
      where.OR = [
        { email: { contains: query.search, mode: "insensitive" } },
        { firstName: { contains: query.search, mode: "insensitive" } },
        { lastName: { contains: query.search, mode: "insensitive" } },
      ];
    }

    const [users, total] = await Promise.all([
      prisma.user.findMany({
        where,
        skip,
        take: limit,
        orderBy: { createdAt: "desc" },
        select: {
          id: true, firstName: true, lastName: true, email: true,
          phone: true, role: true, isActive: true, createdAt: true,
          _count: { select: { orders: true } },
        },
      }),
      prisma.user.count({ where }),
    ]);

    return { users, pagination: { page, limit, total, pages: Math.ceil(total / limit) } };
  }

  async updateUserRole(id: string, role: string) {
    return prisma.user.update({ where: { id }, data: { role: role as any } });
  }

  async toggleUserActive(id: string) {
    const user = await prisma.user.findUnique({ where: { id } });
    if (!user) throw new Error("User not found");
    return prisma.user.update({ where: { id }, data: { isActive: !user.isActive } });
  }

  // ── Stock ──────────────────────────────────────────────────────────────────
  async getStockMovements(query: { page?: string; limit?: string; productId?: string; type?: string }) {
    const page = Number(query.page) || 1;
    const limit = Number(query.limit) || 20;
    const skip = (page - 1) * limit;

    const where: any = {};
    if (query.productId) where.productId = query.productId;
    if (query.type) where.type = query.type;

    const [movements, total] = await Promise.all([
      prisma.stockMovement.findMany({
        where,
        skip,
        take: limit,
        orderBy: { createdAt: "desc" },
        include: { product: { select: { id: true, name: true, sku: true } } },
      }),
      prisma.stockMovement.count({ where }),
    ]);

    return { movements, pagination: { page, limit, total, pages: Math.ceil(total / limit) } };
  }

  // ── Import ─────────────────────────────────────────────────────────────────
  async importFromFile(filePath: string) {
    try {
      const report = await importCatalog(filePath);
      return report;
    } finally {
      if (fs.existsSync(filePath)) fs.unlinkSync(filePath);
    }
  }
}

export const adminService = new AdminService();

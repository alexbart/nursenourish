import type {
  StockMovementQuery,
} from "./stock-movement.types.js";
import { ApiError } from "../../shared/ApiError.js";
import { getPagination } from "../../shared/pagination.js";
import { prisma } from "../../prisma/prisma.js";

import type { CreateStockMovementInput } from "./stock-movement.validator.js";

export class StockMovementService {
  async createStockMovement(data: CreateStockMovementInput) {

    const movement =
      await prisma.$transaction(async (tx) => {
        let inventory = await tx.inventory.findUnique({
          where: {
            productId: data.productId,
          },
        });

        if (!inventory) {
          inventory = await tx.inventory.create({
            data: {
              productId: data.productId,
              quantity: 0,
            },
          });
        }

        const adjustedQuantity = inventory.quantity + data.quantity;

        if (adjustedQuantity < 0) {
          throw new ApiError(
            400,
            `Insufficient stock. Current: ${inventory.quantity}, attempted to ${data.quantity < 0 ? "remove" : "add"} ${Math.abs(data.quantity)}`
          );
        }


        await tx.inventory.update({
          where: {
            id: inventory.id,
          },
          data: {
            quantity: adjustedQuantity,
          },
        });

        const movement = await tx.stockMovement.create({
          data: {
            productId: data.productId,
            type: data.type as any,

            quantity: data.quantity,
            reason: data.reason ?? null,
            reference: data.reference ?? null,
          },
        });

        return movement;
      });

    return movement;
  }

  async getStockMovements(query: StockMovementQuery) {
    const page = Number(query.page) || 1;
    const limit = Number(query.limit) || 20;
    const pagination = getPagination(page, limit);

    const where: any = {};

    if (query.productId) {
      where.productId = query.productId;
    }

    if (query.type) {
      where.type = query.type;
    }

    const [movements, total] = await Promise.all([
      prisma.stockMovement.findMany({
        where,
        orderBy: {
          createdAt: "desc",
        },
        skip: pagination.skip,
        take: pagination.take,
      }),

      prisma.stockMovement.count({
        where,
      }),
    ]);

    return {
      movements,
      pagination: {
        page: pagination.page,
        limit: pagination.limit,
        total,
        pages: Math.ceil(total / pagination.limit),
      },
    };
  }

  async getMovementsByProductId(productId: string) {
    const movements = await prisma.stockMovement.findMany({
      where: {
        productId,
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    return movements;
  }

  async getMovementById(id: string) {
    const movement = await prisma.stockMovement.findUnique({
      where: {
        id,
      },
    });

    if (!movement) {
      throw new ApiError(404, "Stock movement not found");
    }

    return movement;
  }
}

export const stockMovementService = new StockMovementService();

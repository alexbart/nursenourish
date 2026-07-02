import { prisma } from "../prisma/prisma.js";

export abstract class BaseRepository<T> {
  abstract getModel(): {
    findUnique: (args: any) => Promise<T | null>;
    findMany: (args: any) => Promise<T[]>;
    count: (args: any) => Promise<number>;
    create: (args: any) => Promise<T>;
    update: (args: any) => Promise<T>;
    delete: (args: any) => Promise<T>;
  };

  async findById(id: string): Promise<T | null> {
    return this.getModel().findUnique({ where: { id } });
  }

  async findMany(args: {
    where?: Record<string, any>;
    include?: Record<string, any>;
    orderBy?: Record<string, any>;
    skip?: number;
    take?: number;
  } = {}): Promise<T[]> {
    return this.getModel().findMany(args);
  }

  async count(where?: Record<string, any>): Promise<number> {
    return this.getModel().count({ where });
  }

  async create(data: any, include?: Record<string, any>): Promise<T> {
    return this.getModel().create({ data, include });
  }

  async update(id: string, data: any, include?: Record<string, any>): Promise<T> {
    return this.getModel().update({ where: { id }, data, include });
  }

  async delete(id: string): Promise<T> {
    return this.getModel().delete({ where: { id } });
  }
}

export { prisma };
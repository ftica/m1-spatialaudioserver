import { PrismaClient } from '@prisma/client';

export default class ModelService<Model> {
  constructor(
    protected readonly table: string
  ) { }

  async getAll(prisma: PrismaClient): Promise<Model[]> {
    return await prisma[this.table].findMany();
  }

  async getPage(prisma: PrismaClient, page: number, size: number): Promise<Model[]> {
    return await prisma[this.table].findMany({ skip: page * size, take: size });
  }

  async getById(prisma: PrismaClient, id: string, include: any = undefined): Promise<Model> {
    return await prisma[this.table].findUnique({ where: { id } }, { include });
  }

  async create(prisma: PrismaClient, data: Model): Promise<Model> {
    return await prisma[this.table].create({ data });
  }

  async update(prisma: PrismaClient, id: string, data: any, include = undefined): Promise<Model> {
    return await prisma[this.table].update({ where: { id }, data }, include);
  }

  async delete(prisma: PrismaClient, id: string): Promise<Model> {
    return await prisma[this.table].delete({ where: { id } });
  }

  async count(prisma: PrismaClient): Promise<number> {
    return await prisma[this.table].count();
  }
}

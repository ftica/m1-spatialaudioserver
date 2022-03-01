import { PrismaClient } from '@prisma/client';

export default class Service<Model> {
  public table: string;

  constructor(table: string) {
    this.table = table;
  }

  async getById(prisma: PrismaClient, id: string, include: any = undefined): Promise<Model> {
    return await prisma[this.table].findUnique({ where: { id } }, { include });
  }

  async getAll(prisma: PrismaClient): Promise<Model[]> {
    return await prisma[this.table].findMany();
  }

  async getPage(prisma: PrismaClient, page: number, size: number): Promise<Model[]> {
    return await prisma[this.table].findMany({ skip: page * size, take: size });
  }

  async count(prisma: PrismaClient): Promise<number> {
    const num = await prisma[this.table].count();
    return num;
  }

  async update(prisma: PrismaClient, id: string, data, include = undefined): Promise<Model> {
    return await prisma[this.table].update({ where: { id }, data }, include);
  }

  async delete(prisma: PrismaClient, id: string): Promise<Model> {
    return await prisma[this.table].delete({ where: { id } });
  }

  async create(prisma: PrismaClient, data: Model): Promise<Model> {
    return await prisma[this.table].create({ data });
  }
}

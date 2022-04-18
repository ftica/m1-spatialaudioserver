import { Context } from 'koa';

export default class ModelService<Model> {
  constructor(
    protected readonly table: string
  ) { }

  async findOne(ctx: Context, where: any, select: any = undefined): Promise<any> {
    return await ctx.prisma[this.table].findUnique({ where, select });
  }

  async findMany(ctx: Context, where: any = undefined, select: any = undefined, orderBy: any = undefined): Promise<any[]> {
    return await ctx.prisma[this.table].findMany({ where, select, orderBy });
  }

  async findPage(ctx: Context, where: any = undefined, select: any = undefined, orderBy: any = undefined): Promise<any[]> {
    return await ctx.prisma[this.table].findMany({ skip: ctx.page * ctx.size, take: ctx.size, where, select, orderBy });
  }

  async findById(ctx: Context, id: string, select: any = undefined): Promise<any> {
    return await ctx.prisma[this.table].findUnique({ where: { id }, select });
  }

  async createOne(ctx: Context, data: Model, select: any = undefined): Promise<any> {
    return await ctx.prisma[this.table].create({ data, select });
  }

  async createMany(ctx: Context, data: Model, select: any = undefined, orderBy: any = undefined): Promise<any[]> {
    return await ctx.prisma[this.table].createMany({ data, select, orderBy });
  }

  async updateOne(ctx: Context, where: any, data: any, select: any = undefined): Promise<any> {
    return await ctx.prisma[this.table].update({ where, data, select });
  }

  async updateMany(ctx: Context, data: any, where: any = undefined, select: any = undefined, orderBy: any = undefined): Promise<any[]> {
    return await ctx.prisma[this.table].updateMany({ where, data, select, orderBy });
  }

  async updateById(ctx: Context, id: string, data: any, select: any = undefined): Promise<any> {
    return await ctx.prisma[this.table].update({ where: { id }, data, select });
  }

  async deleteOne(ctx: Context, where: any, select: any = undefined): Promise<any> {
    return await ctx.prisma[this.table].delete({ where, select });
  }

  async deleteMany(ctx: Context, where: any = undefined, select: any = undefined, orderBy: any = undefined): Promise<any[]> {
    return await ctx.prisma[this.table].deleteMany({ where, select, orderBy });
  }

  async deleteById(ctx: Context, id: string, select: any = undefined): Promise<any> {
    return await ctx.prisma[this.table].delete({ where: { id }, select });
  }

  async count(ctx: Context, where: any = undefined): Promise<number> {
    return await ctx.prisma[this.table].count({ where });
  }
}

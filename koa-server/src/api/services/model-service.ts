import { Context } from 'koa';
import '../../koa/index';

export default class ModelService<Model> {
  constructor(
    protected readonly table: string
  ) { }

  private with(ctx: Context) {
    // @ts-ignore
    return ctx.prisma[this.table];
  }

  async findOne(ctx: Context, where: any, select: any = undefined): Promise<any> {
    return await this.with(ctx).findUnique({ where, select });
  }

  async findMany(ctx: Context, where: any = undefined, select: any = undefined, orderBy: any = undefined): Promise<any[]> {
    return await this.with(ctx).findMany({ where, select, orderBy });
  }

  async findPage(ctx: Context, page: number, size: number, where: any = undefined, select: any = undefined, orderBy: any = undefined): Promise<any[]> {
    return await this.with(ctx).findMany({ skip: page * size, take: size, where, select, orderBy });
  }

  async findById(ctx: Context, id: string, select: any = undefined): Promise<any> {
    return await this.with(ctx).findUnique({ where: { id }, select });
  }

  async createOne(ctx: Context, data: Partial<Model>, select: any = undefined): Promise<any> {
    return await this.with(ctx).create({ data, select });
  }

  async createMany(ctx: Context, data: Partial<Model>, select: any = undefined, orderBy: any = undefined): Promise<any[]> {
    return await this.with(ctx).createMany({ data, select, orderBy });
  }

  async updateOne(ctx: Context, where: any, data: any, select: any = undefined): Promise<any> {
    return await this.with(ctx).update({ where, data, select });
  }

  async updateMany(ctx: Context, data: any, where: any = undefined, select: any = undefined, orderBy: any = undefined): Promise<any[]> {
    return await this.with(ctx).updateMany({ where, data, select, orderBy });
  }

  async updateById(ctx: Context, id: string, data: any, select: any = undefined): Promise<any> {
    return await this.with(ctx).update({ where: { id }, data, select });
  }

  async deleteOne(ctx: Context, where: any, select: any = undefined): Promise<any> {
    return await this.with(ctx).delete({ where, select });
  }

  async deleteMany(ctx: Context, where: any = undefined, select: any = undefined, orderBy: any = undefined): Promise<any[]> {
    return await this.with(ctx).deleteMany({ where, select, orderBy });
  }

  async deleteById(ctx: Context, id: string, select: any = undefined): Promise<any> {
    return await this.with(ctx).delete({ where: { id }, select });
  }

  async count(ctx: Context, where: any = undefined): Promise<number> {
    return await this.with(ctx).count({ where });
  }
}

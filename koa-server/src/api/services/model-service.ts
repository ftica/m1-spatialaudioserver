<<<<<<< HEAD
import db from '../../koa/db';

export default class ModelService<Model, QueryType> {
  constructor(
    public readonly table: string
  ) { }

  get query(): QueryType { return db[this.table]; }

  async findUnique(where: any, select?: any): Promise<any> {
    return await db[this.table].findUnique({ where, select });
  }

  async findFirst(where: any, select?: any): Promise<any> {
    return await db[this.table].findFirst({ where, select });
  }

  async findById(id: string, select?: any): Promise<any> {
    return await db[this.table].findUnique({ where: { id }, select });
  }

  async findMany(where?: any, select?: any, orderBy?: any): Promise<any[]> {
    return await db[this.table].findMany({ where, select, orderBy });
  }

  async findPage(page: number, size: number, where?: any, select?: any, orderBy?: any): Promise<any[]> {
    return await db[this.table].findMany({ skip: page * size, take: size, where, select, orderBy });
  }

  async createOne(data: Model, select?: any): Promise<any> {
    return await db[this.table].create({ data, select });
  }

  async createMany(data: Model, select?: any, orderBy?: any): Promise<any[]> {
    return await db[this.table].createMany({ data, select, orderBy });
  }

  async updateOne(where: any, data: any, select?: any): Promise<any> {
    return await db[this.table].update({ where, data, select });
  }

  async updateMany(data: any, where?: any, select?: any, orderBy?: any): Promise<any[]> {
    return await db[this.table].updateMany({ where, data, select, orderBy });
  }

  async updateById(id: string, data: any, select?: any): Promise<any> {
    return await db[this.table].update({ where: { id }, data, select });
  }

  async deleteOne(where: any, select?: any): Promise<any> {
    return await db[this.table].delete({ where, select });
  }

  async deleteMany(where?: any, select?: any, orderBy?: any): Promise<any[]> {
    return await db[this.table].deleteMany({ where, select, orderBy });
  }

  async deleteById(id: string, select?: any): Promise<any> {
    return await db[this.table].delete({ where: { id }, select });
  }

  async count(where?: any): Promise<number> {
    return await db[this.table].count({ where });
  }
}
=======
import db from '../../koa/db';

export default class ModelService<Model> {
  constructor(
    protected readonly table: string
  ) { }

  async findUnique(where: any, select: any = undefined): Promise<any> {
    return await db[this.table].findUnique({ where, select });
  }

  async findFirst(where: any, select: any = undefined): Promise<any> {
    return await db[this.table].findFirst({ where, select });
  }

  async findById(id: string, select: any = undefined): Promise<any> {
    return await db[this.table].findUnique({ where: { id }, select });
  }

  async findMany(where: any = undefined, select: any = undefined, orderBy: any = undefined): Promise<any[]> {
    return await db[this.table].findMany({ where, select, orderBy });
  }

  async findPage(page: number, size: number, where: any = undefined, select: any = undefined, orderBy: any = undefined): Promise<any[]> {
    return await db[this.table].findMany({ skip: page * size, take: size, where, select, orderBy });
  }

  async createOne(data: Model, select: any = undefined): Promise<any> {
    return await db[this.table].create({ data, select });
  }

  async createMany(data: Model, select: any = undefined, orderBy: any = undefined): Promise<any[]> {
    return await db[this.table].createMany({ data, select, orderBy });
  }

  async updateOne(where: any, data: any, select: any = undefined): Promise<any> {
    return await db[this.table].update({ where, data, select });
  }

  async updateMany(data: any, where: any = undefined, select: any = undefined, orderBy: any = undefined): Promise<any[]> {
    return await db[this.table].updateMany({ where, data, select, orderBy });
  }

  async updateById(id: string, data: any, select: any = undefined): Promise<any> {
    return await db[this.table].update({ where: { id }, data, select });
  }

  async deleteOne(where: any, select: any = undefined): Promise<any> {
    return await db[this.table].delete({ where, select });
  }

  async deleteMany(where: any = undefined, select: any = undefined, orderBy: any = undefined): Promise<any[]> {
    return await db[this.table].deleteMany({ where, select, orderBy });
  }

  async deleteById(id: string, select: any = undefined): Promise<any> {
    return await db[this.table].delete({ where: { id }, select });
  }

  async count(where: any = undefined): Promise<number> {
    return await db[this.table].count({ where });
  }
}
>>>>>>> 4f682dd63364824e6c113ef1ade3509a1ac71134

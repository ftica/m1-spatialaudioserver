// export function Service<Model>() { return {
//     getById : async (table, id: string): Promise<Model> => await table.findUnique({ where: id }),
//     getList : async (table): Promise<Model[]> => await table.findMany(),
//     getPage : async (table, page: number, size: number): Promise<Model[]> => await table.findMany({ skip: page * size, take: size }),
//     getCount: async (table): Promise<number> => await table.count(),
//     update  : async (table, id: string, data): Promise<Model> => await table.update({ where: { id }, data }),
//     delete  : async (table, id: string): Promise<Model> => await table.delete({ where: { id } })
// }}

export interface PrismaTableAware {
  getTable();
}

export default abstract class Service<Model> implements PrismaTableAware {
  async getById(table, id: string): Promise<Model> {
    return await table.findUnique({ where: id });
  }

  async getAll(table): Promise<Model[]> {
    return await table.findMany();
  }

  async getPage(table, page: number, size: number): Promise<Model[]> {
    return await table.findMany({ skip: page * size, take: size });
  }

  async count(table): Promise<number> {
    return await table.count();
  }

  async update(table, id: string, data): Promise<Model> {
    return await table.update({ where: { id }, data });
  }

  async delete(table, id: string): Promise<Model> {
    return await table.delete({ where: { id } });
  }

  async create(table, data: Model): Promise<Model> {
    return await table.create({ data });
  }

  abstract getTable();
}

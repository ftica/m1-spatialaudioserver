// export function Service<Model>() { return {
//     getById : async (table, id: string): Promise<Model> => await table.findUnique({ where: id }),
//     getList : async (table): Promise<Model[]> => await table.findMany(),
//     getPage : async (table, page: number, size: number): Promise<Model[]> => await table.findMany({ skip: page * size, take: size }),
//     getCount: async (table): Promise<number> => await table.count(),
//     update  : async (table, id: string, data): Promise<Model> => await table.update({ where: { id }, data }),
//     delete  : async (table, id: string): Promise<Model> => await table.delete({ where: { id } })
// }}

export default class Service<Model> {
  async getById(table, id: string, include: any = undefined): Promise<Model> {
    return await table.findUnique({ where: { id } }, { include });
  }

  async getAll(table): Promise<Model[]> {
    return await table.findMany();
  }

  async getPage(table, page: number, size: number): Promise<Model[]> {
    return await table.findMany({ skip: page * size, take: size });
  }

  async count(table): Promise<number> {
    const num = await table.count();
    console.log(num);
    return num;
  }

  async update(table, id: string, data, include = undefined): Promise<Model> {
    return await table.update({ where: { id }, data }, include);
  }

  async delete(table, id: string): Promise<Model> {
    return await table.delete({ where: { id } });
  }

  async create(table, data: Model): Promise<Model> {
    return await table.create({ data });
  }
}
import { CustomContext } from '../../koa/types';
import Service from '../services/service';

export default class ModelEndpoint<Model, ModelService extends Service<Model>> {
  constructor(
    protected readonly service: ModelService
  ) { }

  async getAll(ctx: CustomContext) {
    const models = await this.service.getAll(ctx.prisma);
    ctx.body = models;
  }

  async getById(ctx: CustomContext) {
    const id: string = ctx.params.id;
    const model = await this.service.getById(ctx.prisma, id);
    if (model === null) {
      ctx.status = 404;
    } else {
      ctx.body = model;
    }
  }

  async getPage(ctx: CustomContext) {
    const page: number = ctx.params.page;
    const size: number = ctx.params.size;
    const models = await this.service.getPage(ctx.prisma, page, size);
    ctx.body = models;
  }

  async count(ctx: CustomContext) {
    ctx.body = await this.service.count(ctx.prisma);
  }

  async create(ctx: CustomContext) {
    const data: Model = ctx.request.body;
    const model = await this.service.create(ctx.prisma, data);
    ctx.body = model;
  }

  async update(ctx: CustomContext) {
    const id: string = ctx.params.id;
    const data: Model = ctx.request.body;
    const model = await this.service.update(ctx.prisma, id, data);
    if (model == null) {
      ctx.status = 404;
    } else {
      ctx.body = model;
    }
  }

  async del(ctx: CustomContext) {
    const id: string = ctx.params.id;
    const model = await this.service.delete(ctx.prisma, id);
    if (model == null) {
      ctx.status = 404;
    } else {
      ctx.body = model;
    }
  }
}

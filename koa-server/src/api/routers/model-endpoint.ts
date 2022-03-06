import { Context } from 'koa';
import Service from '../services/service';

export default class ModelEndpoint<Model, ModelService extends Service<Model>> {
  constructor(
    protected readonly service: ModelService
  ) { }

  async getAll(ctx: Context) {
    const models = await this.service.getAll(ctx.prisma);
    ctx.body = models;
  }

  async getPage(ctx: Context) {
    const page: number = ctx.params.page;
    const size: number = ctx.params.size;
    const models = await this.service.getPage(ctx.prisma, page, size);
    ctx.body = models;
  }

  async getById(ctx: Context) {
    const id: string = ctx.params.id;
    const model = await this.service.getById(ctx.prisma, id);
    if (model === null) {
      ctx.status = 404;
    } else {
      ctx.body = model;
    }
  }

  async create(ctx: Context) {
    const data: Model = ctx.request.body;
    const model = await this.service.create(ctx.prisma, data);
    ctx.body = model;
  }

  async update(ctx: Context) {
    const id: string = ctx.params.id;
    const data: Model = ctx.request.body;
    const model = await this.service.update(ctx.prisma, id, data);
    if (model == null) {
      ctx.status = 404;
    } else {
      ctx.body = model;
    }
  }

  async del(ctx: Context) {
    const id: string = ctx.params.id;
    const model = await this.service.delete(ctx.prisma, id);
    if (model == null) {
      ctx.status = 404;
    } else {
      ctx.body = model;
    }
  }

  async count(ctx: Context) {
    ctx.body = await this.service.count(ctx.prisma);
  }
}

import Joi from 'joi';
import { Context } from 'koa';
import { NotFound, Ok, Validate } from '../decorators';
import Service from '../services/service';
import { Valid } from '../validator';

export default class ModelEndpoint<Model, ModelService extends Service<Model>> {
  constructor(
    protected readonly service: ModelService
  ) { }

  @Ok
  async getAll(ctx: Context) {
    return await this.service.getAll(ctx.prisma);
  }

  @Validate(Joi.object({ id: Valid.id, page: Valid.uint, size: Valid.uint }))
  @Ok
  async getPage(ctx: Context) {
    return await this.service.getPage(ctx.prisma, ctx.params.page, ctx.params.size);
  }

  @Validate(Valid.idObject)
  @NotFound
  async getById(ctx: Context) {
    return await this.service.getById(ctx.prisma, ctx.params.id);
  }

  @Ok
  async create(ctx: Context) {
    return await this.service.create(ctx.prisma, ctx.request.body);
  }

  @Validate(Valid.idObject)
  @NotFound
  async update(ctx: Context) {
    return await this.service.update(ctx.prisma, ctx.params.id, ctx.request.body);
  }

  @Validate(Valid.idObject)
  @NotFound
  async del(ctx: Context) {
    return await this.service.delete(ctx.prisma, ctx.params.id);
  }

  @Ok
  async count(ctx: Context) {
    return await this.service.count(ctx.prisma);
  }
}

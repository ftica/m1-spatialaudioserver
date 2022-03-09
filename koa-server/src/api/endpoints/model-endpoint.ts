import { Role } from '@prisma/client';
import Joi from 'joi';
import { Context } from 'koa';
import { AuthorizeRole, NotFound, Ok, Validate } from '../util/decorators';
import ModelService from '../services/model-service';
import { Valid } from '../util/valid';

export default class ModelEndpoint<Model, Service extends ModelService<Model>> {
  constructor(
    protected readonly service: Service
  ) { }

  @AuthorizeRole(Role.ADMIN)
  @Ok
  async getAll(ctx: Context) {
    return await this.service.getAll(ctx.prisma);
  }

  @AuthorizeRole(Role.ADMIN)
  @Validate(Joi.object({ id: Valid.id, page: Valid.uint, size: Valid.uint }))
  @Ok
  async getPage(ctx: Context) {
    return await this.service.getPage(ctx.prisma, ctx.params.page, ctx.params.size);
  }

  @AuthorizeRole(Role.ADMIN)
  @Validate(Valid.idObject)
  @NotFound()
  async getById(ctx: Context) {
    return await this.service.getById(ctx.prisma, ctx.params.id);
  }

  @AuthorizeRole(Role.ADMIN)
  @Ok
  async create(ctx: Context) {
    return await this.service.create(ctx.prisma, ctx.request.body);
  }

  @AuthorizeRole(Role.ADMIN)
  @Validate(Valid.idObject)
  @NotFound()
  async update(ctx: Context) {
    return await this.service.update(ctx.prisma, ctx.params.id, ctx.request.body);
  }

  @AuthorizeRole(Role.ADMIN)
  @Validate(Valid.idObject)
  @NotFound()
  async del(ctx: Context) {
    return await this.service.delete(ctx.prisma, ctx.params.id);
  }

  @AuthorizeRole(Role.ADMIN)
  @Ok
  async count(ctx: Context) {
    return await this.service.count(ctx.prisma);
  }
}

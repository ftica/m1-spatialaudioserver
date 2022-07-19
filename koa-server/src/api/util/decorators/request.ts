import Joi from 'joi';
import { Context } from 'koa';
import { Valid } from './validation';

declare module 'koa' {
  // eslint-disable-next-line no-unused-vars
  interface Context {
    page?: number;
    size?: number;
  }
}

export function Paginate(defaultPageSize: number = 50, maxPageSize: number = 100) {
  return function (_target: any, _methodName: string, descriptor: PropertyDescriptor) {
    const originalMethod = descriptor.value;

    descriptor.value = async function (ctx: Context) {
      const { error, value } = Joi.object({
        page: Valid.uint.default(0),
        size: Valid.uint.max(maxPageSize).default(defaultPageSize)
      }).validate({
        page: ctx.query.page,
        size: ctx.query.size
      });

      if (error) return ctx.throw(error.message, 400);

      ctx.page = parseInt(value.page);
      ctx.size = parseInt(value.size);
      return await originalMethod.call(this, ctx);
    };

    return descriptor;
  };
}

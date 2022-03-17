import { Role } from '@prisma/client';
import Joi, { Schema } from 'joi';
import { Context } from 'koa';
import { Valid } from './valid';

export function Authorize(authFun: (ctx: Context) => boolean) {
  return function (_target: any, _methodName: string, descriptor: PropertyDescriptor) {
    const originalMethod = descriptor.value;

    descriptor.value = async function (ctx: Context) {
      if (authFun(ctx)) return await originalMethod.call(this, ctx);
      ctx.status = 401;
    };

    return descriptor;
  };
}

export const AuthorizeLogged =
  Authorize((ctx: Context) => ctx.token !== null);

export const AuthorizeAdmin =
  Authorize((ctx: Context) => ctx.admin === true);

export function AuthorizeRole(...roles: Role[]) {
  return Authorize((ctx: Context) => roles.includes(ctx.token?.role));
}

export const AuthorizeMe =
  Authorize((ctx: Context) => ctx.token && (ctx.admin || ctx.token.username === ctx.params.username));

export function Validate({ params, body, query }: { params?: Schema, body?: Schema, query?: Schema } = {}) {
  return function (_target: any, _methodName: string, descriptor: PropertyDescriptor) {
    const originalMethod = descriptor.value;

    descriptor.value = async function (ctx: Context) {
      let res = params?.validate(ctx.params);
      if (res?.error) return ctx.throw(400, res.error.message);
      if (res?.value) ctx.params = res.value;

      res = body?.validate(ctx.request.body);
      if (res?.error) return ctx.throw(400, res.error.message);
      if (res?.value) ctx.request.body = res.value;

      res = query?.validate(ctx.query);
      if (res?.error) return ctx.throw(400, res.error.message);
      if (res?.value) ctx.query = res.value;

      return await originalMethod.call(this, ctx);
    };

    return descriptor;
  };
}

export function Ok(_target: any, _methodName: string, descriptor: PropertyDescriptor) {
  const originalMethod = descriptor.value;

  descriptor.value = async function (ctx: Context) {
    ctx.body = await originalMethod.call(this, ctx);
  };

  return descriptor;
};

export function NotFound(status: number = 404) {
  return function (_target: any, _methodName: string, descriptor: PropertyDescriptor) {
    const originalMethod = descriptor.value;

    descriptor.value = async function (ctx: Context) {
      const result = await originalMethod.call(this, ctx);
      if (result) ctx.body = result;
      else ctx.status = status;
    };

    return descriptor;
  };
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

      if (error) return ctx.throw(400, error.message);

      ctx.page = parseInt(value.page);
      ctx.size = parseInt(value.size);
      return await originalMethod.call(this, ctx);
    };

    return descriptor;
  };
}

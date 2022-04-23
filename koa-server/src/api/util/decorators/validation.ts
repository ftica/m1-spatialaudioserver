import { Schema } from 'joi';
import { Context } from 'koa';

export function Validator(status: number, errorMessage: string, testFun: (ctx: Context) => boolean) {
  return function (_target: any, _methodName: string, descriptor: PropertyDescriptor) {
    const originalMethod = descriptor.value;

    descriptor.value = async function (ctx: Context) {
      if (testFun(ctx)) return await originalMethod.call(this, ctx);
      ctx.status = status;
      if (errorMessage) ctx.body = errorMessage;
    };

    return descriptor;
  };
}

export function Validate({ params, body, query }: { params?: Schema, body?: Schema, query?: Schema } = {}) {
  return function (_target: any, _methodName: string, descriptor: PropertyDescriptor) {
    const originalMethod = descriptor.value;

    descriptor.value = async function (ctx: Context) {
      if (params) {
        const res = params.validate(ctx.params);
        if (res?.error) return ctx.throw(400, res.error.message);
        if (res?.value) ctx.params = res.value;
      }

      if (body) {
        const res = body.validate(ctx.request.body);
        if (res?.error) return ctx.throw(400, res.error.message);
        if (res?.value) ctx.request.body = res.value;
      }

      if (query) {
        const res = query.validate(ctx.query);
        if (res?.error) return ctx.throw(400, res.error.message);
        if (res?.value) ctx.query = res.value;
      }

      return await originalMethod.call(this, ctx);
    };

    return descriptor;
  };
}

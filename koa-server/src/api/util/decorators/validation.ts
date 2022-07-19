import { Role } from '@prisma/client';
import Joi, { Schema } from 'joi';
import { Context } from 'koa';

const id = Joi.string().uuid();
const idParam = Joi.object({ id });
const idArray = Joi.array().items(id).unique().min(0);
const uint = Joi.number().integer().min(0);
const bool = Joi.bool();
const email = Joi.string().email();
const role = Joi.string().valid(Role.USER, Role.ADMIN);

export const Valid = {
  id,
  idParam,
  idArray,
  uint,
  bool,
  email,
  role
};

export function Validator(status: number, errorMessage: string, testFun: (ctx: Context) => Promise<boolean>) {
  return function (_target: any, _methodName: string, descriptor: PropertyDescriptor) {
    const originalMethod = descriptor.value;

    descriptor.value = async function (ctx: Context) {
      if (await testFun(ctx)) return await originalMethod.call(this, ctx);
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
        if (res?.error) return ctx.throw(res.error.message, 400);
        if (res?.value) ctx.params = res.value;
      }

      if (body) {
        const res = body.validate(ctx.request.body);
        if (res?.error) return ctx.throw(res.error.message, 400);
        if (res?.value) ctx.request.body = res.value;
      }

      if (query) {
        const res = query.validate(ctx.query);
        if (res?.error) return ctx.throw(res.error.message, 400);
        if (res?.value) ctx.query = res.value;
      }

      return await originalMethod.call(this, ctx);
    };

    return descriptor;
  };
}

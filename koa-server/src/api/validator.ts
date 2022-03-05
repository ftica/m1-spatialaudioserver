import { ObjectSchema } from 'joi';
import { Next } from 'koa';
import { CustomContext } from '../koa/types';

export default (paramsSchema?: ObjectSchema, bodySchema?: ObjectSchema) => async (ctx: CustomContext, next: Next): Promise<void> => {
  const error = paramsSchema?.validate(ctx.params).error ?? bodySchema?.validate(ctx.request.body).error;
  if (!error) return await next();
  ctx.status = 400;
  ctx.body = error.message;
};

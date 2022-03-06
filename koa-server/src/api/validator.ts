import Joi, { Schema } from 'joi';
import { Next } from 'koa';
import { CustomContext } from '../koa/types';

export default (paramsSchema?: Schema, bodySchema?: Schema) => async (ctx: CustomContext, next: Next): Promise<void> => {
  const error = paramsSchema?.validate(ctx.params).error ?? bodySchema?.validate(ctx.request.body).error;
  if (!error) return await next();
  ctx.status = 400;
  ctx.body = error.message;
};

const id = Joi.string().uuid().required();
const idObject = Joi.object({ id });
const idArray = Joi.array().items(id).min(0).required();
const uint = Joi.number().integer().min(0).required();
const bool = Joi.bool().required();

export const Valid = {
  uint,
  bool,
  id,
  idObject,
  idArray
};

import Joi from 'joi';

// export default (paramsSchema?: Schema, bodySchema?: Schema) => async (ctx: Context, next: Next): Promise<void> => {
//   const error = paramsSchema?.validate(ctx.params).error ?? bodySchema?.validate(ctx.request.body).error;
//   if (!error) return await next();
//   ctx.status = 400;
//   ctx.body = error.message;
// };

const id = Joi.string().uuid().required();
const idParam = Joi.object({ id });
const idArray = Joi.array().items(id).min(0).required();
const uint = Joi.number().integer().min(0).required();
const bool = Joi.bool().required();
const pageQuery = Joi.object({ page: uint, size: uint.max(100) });

export const Valid = {
  uint,
  bool,
  id,
  idParam,
  idArray,
  pageQuery
};

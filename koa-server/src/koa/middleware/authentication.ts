import { Context, Next } from 'koa';

export default () => async (ctx: Context, next: Next) => {
  if (!ctx.token) {
    ctx.throw(400, 'Failed to authenticate user');
  }

  await next();
};

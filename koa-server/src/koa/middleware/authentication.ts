import { Next } from 'koa';
import { CustomContext } from '.';

export default () => async (ctx: CustomContext, next: Next) => {
  if (!ctx.token) {
    ctx.throw(400, 'Failed to authenticate user');
  }

  return next();
};

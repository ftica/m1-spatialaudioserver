import { Next } from 'koa';
import { CustomContext } from '../types';
import { verify } from '../../auth/token';

export default () => async (ctx: CustomContext, next: Next) => {
  delete ctx.token;

  if (ctx.headers.authorization != null) {
    const rawToken = ctx.headers.authorization.replace('Bearer ', '');
    ctx.token = await verify(rawToken);
  }

  await next();
};

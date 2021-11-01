import { verify } from '../auth/token';

export default () => async (ctx, next) => {
  ctx.token = {};

  if (ctx.headers.authorization != null) {
    const rawToken = ctx.headers.authorization.replace('Bearer ', '');
    ctx.token = await verify(rawToken);
  }

  return next();
};

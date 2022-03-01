import { Next } from 'koa';
import { CustomContext } from '../types';
import getJwtService, { JwtService } from '../../api/services/jwt';

export default () => async (ctx: CustomContext, next: Next) => {
  delete ctx.token;

  const jwtService: JwtService = await getJwtService();

  if (ctx.headers.authorization != null) {
    const rawToken = ctx.headers.authorization.replace('Bearer ', '');
    ctx.token = await jwtService.verify(rawToken);
  }

  return await next();
};

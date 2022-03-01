import { Next } from 'koa';
import { CustomContext } from '../types';
import getJwtService, { JwtService, JwtToken } from '../../api/services/jwt';
// import { Jwt } from 'jsonwebtoken';

export default () => async (ctx: CustomContext, next: Next) => {
  delete ctx.token;

  const jwtService: JwtService = await getJwtService();

  if (ctx.headers.authorization != null) {
    const rawToken = ctx.headers.authorization.replace('Bearer ', '');
    const token: JwtToken = await jwtService.verify(rawToken);

    ctx.token = token;
  }

  await next();
};

import { Jwt } from 'jsonwebtoken';
import { Context, Next } from 'koa';
import jwtService, { Token } from '../../api/services/jwt-service';

export default () => async (ctx: Context, next: Next) => {
  if (ctx.headers.authorization != null) {
    const rawToken = ctx.headers.authorization.slice('Bearer '.length);
    const token: Jwt = await jwtService.verify(rawToken);
    ctx.token = token.payload as Token;
  }

  await next();
};

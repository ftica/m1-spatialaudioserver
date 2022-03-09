import { Jwt } from 'jsonwebtoken';
import { Context, Next } from 'koa';
import jwtService, { Token } from '../../api/services/jwt-service';
import { now } from '../../api/util/time';

export default () => async (ctx: Context, next: Next) => {
  if (ctx.headers.authorization != null) {
    const rawToken = ctx.headers.authorization.slice('Bearer '.length);
    const jwtToken: Jwt = await jwtService.verify(rawToken);
    const token = jwtToken.payload as Token;
    token.validUntil = new Date(token.validUntil);

    if (token.validUntil < now()) ctx.throw(401, 'Token expired');
    else ctx.token = token;
  }

  await next();
};

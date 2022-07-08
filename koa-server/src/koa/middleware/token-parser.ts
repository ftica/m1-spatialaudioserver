import { Role } from '@prisma/client';
import { Jwt } from 'jsonwebtoken';
import { Context, Next } from 'koa';
import jwtService, { Token } from '../../api/services/jwt-service';
import userService from '../../api/services/user-service';
import { now } from '../../api/util/time';

declare module 'koa' {
  // eslint-disable-next-line no-unused-vars
  interface Context {
    token?: Token;
    admin?: boolean;
  }
}

export default () => async (ctx: Context, next: Next) => {
  if (ctx.headers.authorization != null) {
    try {
      const rawToken = ctx.headers.authorization.slice('Bearer '.length);
      const jwtToken: Jwt = await jwtService.verify(rawToken);
      const token = jwtToken.payload as Token;
      token.validUntil = new Date(token.validUntil);

      if (token.validUntil < now()) ctx.throw(401, 'Token expired');
      else {
        ctx.token = token;
        ctx.admin = token?.role === Role.ADMIN;

        userService.seenNow(ctx.token.username);
      }
    } catch (err) { }
  }

  await next();
};

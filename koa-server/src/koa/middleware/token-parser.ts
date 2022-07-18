import { Role } from '@prisma/client';
import { JsonWebTokenError, Jwt } from 'jsonwebtoken';
import { Context, Next } from 'koa';
import jwtService, { TokenPayload } from '../../api/services/jwt-service';
import userService from '../../api/services/user-service';

declare module 'koa' {
  // eslint-disable-next-line no-unused-vars
  interface Context {
    token?: TokenPayload;
    admin?: boolean;
  }
}

export default () => async (ctx: Context, next: Next) => {
  if (ctx.headers.authorization != null) {
    try {
      const rawToken = ctx.headers.authorization.slice('Bearer '.length);
      const jwtToken: Jwt = await jwtService.verify(rawToken);
      const token = jwtToken.payload as TokenPayload;

      if ((token.iat + token.exp) * 1000 < Date.now()) ctx.throw(401, 'Token expired');
      else {
        ctx.token = token;
        ctx.admin = token?.role === Role.ADMIN;

        userService.seenNow(ctx.token.username);
      }
    } catch (err) {
      if (err instanceof JsonWebTokenError && err.message === 'invalid signature') ctx.throw(401, 'Invalid signature');
    }
  }

  await next();
};

import { Role } from '@prisma/client';
import { Jwt, JsonWebTokenError, NotBeforeError, TokenExpiredError } from 'jsonwebtoken';
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

      ctx.token = token;
      ctx.admin = token.role === Role.ADMIN;

      userService.seenNow(ctx.token.username);
    } catch (err) {
      if (err instanceof TokenExpiredError || err instanceof JsonWebTokenError || err instanceof NotBeforeError) ctx.throw(401, err.message);
    }
  }

  await next();
};

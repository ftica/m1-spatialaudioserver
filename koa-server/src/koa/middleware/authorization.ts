import { Role } from '@prisma/client';
import { Next } from 'koa';
import { Token } from '../../api/services/jwt-service';
import { CustomContext } from '../types';

export const authorize = (tokenTestFn: (token: Token) => boolean) => async (ctx: CustomContext, next: Next) => {
  if (!tokenTestFn(ctx.token)) {
    ctx.throw(403, 'Unauthorized!');
  }

  await next();
};

export const hasAnyRole = (...roles: Role[]) =>
  authorize((token: Token) => roles.includes(token.role));

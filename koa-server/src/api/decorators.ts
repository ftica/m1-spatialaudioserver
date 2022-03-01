import { Context } from 'koa';
import { Role } from '@prisma/client';

type AsyncHandler = (ctx: Context, next?: () => any) => Promise<any>;

export function Authenticated(handler: Function) {
  const authenticatedHandler = async (ctx: Context, next?: () => any) => {
    if (!ctx.token)
      ctx.throw(400, 'Failed to authenticate user');

    return await handler(ctx, next);
  };

  return authenticatedHandler;
}

export function Authorized(allowedRoles: Role[], handler: AsyncHandler): AsyncHandler {
  const authorizedHandler: AsyncHandler = async (ctx: Context, next?: () => any) => {
    if (!ctx.token.roles ||
      !allowedRoles.some(allowed => (ctx.token.roles as string[]).includes(allowed)))
      return await ctx.throw(403, 'Unauthorized');

    return await handler(ctx, next);
  };

  return Authenticated(authorizedHandler);
}

import { Role } from '@prisma/client';
import { Context } from 'koa';

export function Authorize(authFun: (ctx: Context) => Promise<boolean>) {
  return function (_target: any, _methodName: string, descriptor: PropertyDescriptor) {
    const originalMethod = descriptor.value;

    descriptor.value = async function (ctx: Context) {
      if (await authFun(ctx)) return await originalMethod.call(this, ctx);
      ctx.status = 401;
    };

    return descriptor;
  };
}

export const AuthorizeLogged =
  Authorize(async (ctx: Context) => ctx.token !== undefined);

export const AuthorizeAdmin =
  Authorize(async (ctx: Context) => ctx.admin === true);

export const AuthorizeRole = (...roles: Role[]) =>
  Authorize(async (ctx: Context) => ctx.token && roles.includes(ctx.token.role));

export const AuthorizeMe =
  Authorize(async (ctx: Context) => ctx.admin || (ctx.token && (ctx.token.username === ctx.params.username)));

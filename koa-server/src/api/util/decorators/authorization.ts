import { Role } from '@prisma/client';
import { Context } from 'koa';

export function Authorize(authFun: (ctx: Context) => boolean) {
  return function (_target: any, _methodName: string, descriptor: PropertyDescriptor) {
    const originalMethod = descriptor.value;

    descriptor.value = async function (ctx: Context) {
      if (authFun(ctx)) return await originalMethod.call(this, ctx);
      ctx.status = 401;
    };

    return descriptor;
  };
}

export const AuthorizeLogged =
  Authorize((ctx: Context) => ctx.token !== undefined);

export const AuthorizeAdmin =
  Authorize((ctx: Context) => ctx.admin === true);

export function AuthorizeRole(...roles: Role[]) {
  return Authorize((ctx: Context) => roles.includes(ctx.token?.role));
}

export const AuthorizeMe =
  Authorize((ctx: Context) => ctx.token && (ctx.admin || ctx.token.username === ctx.params.username));

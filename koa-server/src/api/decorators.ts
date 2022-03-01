import { Role } from '@prisma/client';
import { Next } from 'koa';
import { CustomContext } from '../koa/types';

export namespace Security {
  type AsyncHandler = (ctx: CustomContext, next?: Next) => Promise<any>;

  const getAuthenticatedHandler = (original: AsyncHandler): AsyncHandler =>
    async (ctx: CustomContext, next?: Next) => {
      if (!ctx.token) {
        ctx.throw(400, 'Failed to authenticate user');
      }

      return await original(ctx, next);
    };

  const getAuthorizedHandler = (original: AsyncHandler, roles: Role[]): AsyncHandler =>
    async (ctx: CustomContext, next?: Next) => {
      if (!ctx.token.roles) {
        ctx.throw(400, 'Failed to authorize user');
      }

      if (!roles.filter(r => ctx.token.roles.includes(r)).length) {
        ctx.throw(403, 'Unauthorized');
      }

      return await original(ctx, next);
    };

  const getValidBodyHandler = (original: AsyncHandler, valid: any): AsyncHandler =>
    async (ctx: CustomContext, next?: Next) => {
      if (!ctx.validate) {
        ctx.throw(500, 'Validator not present');
      }

      await ctx.validate(valid);

      return await original(ctx, next);
    };

  export const Authenticated: MethodDecorator = (target: any, propertyKey: string | symbol, descriptor: PropertyDescriptor) => {
    const original: AsyncHandler = descriptor.value!;

    descriptor.value = getAuthenticatedHandler(original);
  };

  export function Authorized(...roles: Role[]): MethodDecorator {
    return (target: any, propertyKey: string | symbol, descriptor: PropertyDescriptor) => {
      const original: AsyncHandler = descriptor.value!;
      const authenticated: AsyncHandler = getAuthenticatedHandler(original);

      descriptor.value = getAuthorizedHandler(authenticated, roles);
    };
  }

  export function ValidBody(valid: any): MethodDecorator {
    return (target: any, propertyKey: string | symbol, descriptor: PropertyDescriptor) => {
      const original: AsyncHandler = descriptor.value!;

      descriptor.value = getValidBodyHandler(original, valid);
    };
  }
}

import { Context } from 'koa';

export namespace Security {
  type AsyncHandler = (ctx: Context, next?: () => any) => Promise<any>;

  const getAuthenticatedHandler = (original: AsyncHandler): AsyncHandler =>
    async (ctx: Context, next?: () => any) => {
      if (!ctx.token)
        ctx.throw(400, 'Failed to authenticate user');

      return await original(ctx, next);
    };

  const getAuthorizedHandler = (original: AsyncHandler, roles: string[]): AsyncHandler =>
    async (ctx: Context, next?: () => any) => {
      if (!ctx.token.roles)
        ctx.throw(400, 'Failed to authorize user');

      if (!ctx.token.roles.some(roles.includes))
        ctx.throw(403, 'Unauthorized');

      return await original(ctx, next);
    };

  const getValidBodyHandler = (original: AsyncHandler, valid: any): AsyncHandler =>
    async (ctx: Context, next?: () => any) => {
      if (!ctx.validate)
        ctx.throw(500, 'Validator not present');

      await ctx.validate(valid);

      return await original(ctx, next);
    };

  export const Authenticated: MethodDecorator = (target: any, propertyKey: string | symbol, descriptor: PropertyDescriptor) => {
    const original: AsyncHandler = descriptor.value!;

    descriptor.value = getAuthenticatedHandler(original);
  };

  export function Authorized(...roles: string[]): MethodDecorator {
    return (target: any, propertyKey: string | symbol, descriptor: PropertyDescriptor) => {
      const original: AsyncHandler = descriptor.value!;
      const authenticated: AsyncHandler = getAuthenticatedHandler(original);

      descriptor.value = getAuthorizedHandler(authenticated, roles);
    }
  }

  export function ValidBody(valid: any): MethodDecorator {
    return (target: any, propertyKey: string | symbol, descriptor: PropertyDescriptor) => {
      const original: AsyncHandler = descriptor.value!;

      descriptor.value = getValidBodyHandler(original, valid);
    }
  }
}
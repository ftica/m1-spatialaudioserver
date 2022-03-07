import { Role } from '@prisma/client';
import { Schema } from 'joi';
import { Context } from 'koa';

// export namespace Security {
//   type AsyncHandler = (ctx: Context, next?: Next) => Promise<any>;

//   const getAuthenticatedHandler = (original: AsyncHandler): AsyncHandler =>
//     async (ctx: Context, next?: Next) => {
//       if (!ctx.token) {
//         ctx.throw(400, 'Failed to authenticate user');
//       }

//       return await original(ctx, next);
//     };

//   const getAuthorizedHandler = (original: AsyncHandler, roles: Role[]): AsyncHandler =>
//     async (ctx: Context, next?: Next) => {
//       if (!ctx.token.role) {
//         ctx.throw(400, 'Failed to authorize user');
//       }

//       if (!roles.includes(ctx.token.role)) {
//         ctx.throw(403, 'Unauthorized');
//       }

//       return await original(ctx, next);
//     };

//   const getValidBodyHandler = (original: AsyncHandler, valid: any): AsyncHandler =>
//     async (ctx: Context, next?: Next) => {
//       if (!ctx.validate) {
//         ctx.throw(500, 'Validator not present');
//       }

//       await ctx.validate(valid);

//       return await original(ctx, next);
//     };

//   export const Authenticated: MethodDecorator = (target: any, propertyKey: string | symbol, descriptor: PropertyDescriptor) => {
//     const original: AsyncHandler = descriptor.value!;

//     descriptor.value = getAuthenticatedHandler(original);
//   };

//   export function Authorized(...roles: Role[]): MethodDecorator {
//     return (target: any, propertyKey: string | symbol, descriptor: PropertyDescriptor) => {
//       const original: AsyncHandler = descriptor.value!;
//       const authenticated: AsyncHandler = getAuthenticatedHandler(original);

//       descriptor.value = getAuthorizedHandler(authenticated, roles);
//     };
//   }

//   export function ValidBody(valid: any): MethodDecorator {
//     return (target: any, propertyKey: string | symbol, descriptor: PropertyDescriptor) => {
//       const original: AsyncHandler = descriptor.value!;

//       descriptor.value = getValidBodyHandler(original, valid);
//     };
//   }
// }

export function AuthorizeRole(...roles: Role[]) {
  return function (_target: any, _methodName: string, descriptor: PropertyDescriptor) {
    const originalMethod = descriptor.value;

    descriptor.value = async function (ctx: Context) {
      // TODO: Current user has one of the roles in roles[]
      return await originalMethod.call(this, ctx);
    };

    return descriptor;
  };
}

export function Authorize(authFun: (ctx: Context) => boolean) {
  return function (_target: any, _methodName: string, descriptor: PropertyDescriptor) {
    const originalMethod = descriptor.value;

    descriptor.value = async function (ctx: Context) {
      if (authFun(ctx)) return await originalMethod.call(this, ctx);
      else ctx.status = 401;
    };

    return descriptor;
  };
}

export function Validate(paramsSchema?: Schema, bodySchema?: Schema) {
  return function (_target: any, _methodName: string, descriptor: PropertyDescriptor) {
    const originalMethod = descriptor.value;

    descriptor.value = async function (ctx: Context) {
      const error = paramsSchema?.validate(ctx.params).error ?? bodySchema?.validate(ctx.request.body).error;
      if (!error) return await originalMethod.call(this, ctx);
      ctx.status = 400;
      ctx.body = error.message;
    };

    return descriptor;
  };
}

export function Ok(_target: any, _methodName: string, descriptor: PropertyDescriptor) {
  const originalMethod = descriptor.value;

  descriptor.value = async function (ctx: Context) {
    ctx.body = await originalMethod.call(this, ctx);
  };

  return descriptor;
};

export function NotFound(_target: any, _methodName: string, descriptor: PropertyDescriptor) {
  const originalMethod = descriptor.value;

  descriptor.value = async function (ctx: Context) {
    const result = await originalMethod.call(this, ctx);
    if (result) ctx.body = result;
    else ctx.status = 404;
  };

  return descriptor;
};

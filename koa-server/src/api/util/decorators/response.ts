import { Context } from 'koa';

export function Ok(status: number = 200) {
  return function(_target: any, _methodName: string, descriptor: PropertyDescriptor) {
    const originalMethod = descriptor.value;

    descriptor.value = async function (ctx: Context) {
      ctx.body = await originalMethod.call(this, ctx);
      ctx.status = status;
    };

    return descriptor;
  };
}

export function NotFound(status: number = 404) {
  return function (_target: any, _methodName: string, descriptor: PropertyDescriptor) {
    const originalMethod = descriptor.value;

    descriptor.value = async function (ctx: Context) {
      try {
        const result = await originalMethod.call(this, ctx);
        if (result == null) ctx.status = status;
        else ctx.body = result;
      } catch (err) {
        ctx.status = 404;
      }
    };

    return descriptor;
  };
}

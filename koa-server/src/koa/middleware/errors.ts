import { Context, Next } from 'koa';

export default () => async (ctx: Context, next: Next) => {
  try {
    await next();
  } catch (error) {
    console.error(error);

    ctx.status = error.statusCode ?? 500;
    if (error.message) {
      ctx.body = error.message;
    }
  }
};

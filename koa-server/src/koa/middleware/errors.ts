import { Context, Next } from 'koa';

export default () => async (ctx: Context, next: Next) => {
  try {
    await next();
  } catch (error) {
    console.error(error);
    const { statusCode = 500, message = 'Unknown error' } = error;

    ctx.status = statusCode;
    ctx.body = { message };
  }
};

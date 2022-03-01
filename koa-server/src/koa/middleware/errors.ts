import { Next } from 'koa';
import { CustomContext } from '.';

export default () => async (ctx: CustomContext, next: Next) => {
  try {
    await next();
  } catch (error) {
    console.error(error);
    const { statusCode = 500, message = 'Unknown error' } = error;

    ctx.status = statusCode;
    ctx.body = { message };
  }
};

import { Next } from 'koa';
import { CustomContext } from '../types';
// import jwtService, { Token } from '../../api/services/jwt-service';

export default () => async (ctx: CustomContext, next: Next) => {
  delete ctx.token;

  if (ctx.headers.authorization != null) {
    // const rawToken = ctx.headers.authorization.replace('Bearer ', '');
    // const token: Token = await jwtService.verify(rawToken);

    // ctx.token = token;
  }

  await next();
};

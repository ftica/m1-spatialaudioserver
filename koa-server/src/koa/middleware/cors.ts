/* eslint-disable consistent-return */
// import _ from 'lodash';
import { Next } from 'koa';
import { CustomContext } from '.';

export default () => {
  const defaultOptions = {
    allowMethods: ['GET', 'HEAD', 'POST', 'PUT', 'DELETE', 'PATCH'],
    allowHeaders: ['Content-Type', 'Set-Cookie', 'Cookie']
  };

  return async (ctx: CustomContext, next: Next) => {
    const origin = ctx.get('Origin');
    ctx.vary('Origin');

    if (!origin) return next();

    ctx.set('Access-Control-Allow-Origin', origin);
    ctx.set('Access-Control-Allow-Credentials', 'true');

    if (ctx.method !== 'OPTIONS') {
      return next().catch((err) => {
        if (err.headers === null) err.headers = {};
        err.headers['Access-Control-Allow-Origin'] = origin;
        // _.set(err, 'headers.Access-Control-Allow-Origin', origin);
        err.headers['headers.Access-Control-Allow-Credentials'] = 'true';
        throw err;
      });
    }
    ctx.set('Access-Control-Allow-Methods', defaultOptions.allowMethods.join(','));
    ctx.set('Access-Control-Allow-Headers', defaultOptions.allowHeaders.join(','));

    ctx.status = 204;
  };
};

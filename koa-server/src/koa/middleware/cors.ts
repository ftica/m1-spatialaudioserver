import { Context, Next } from 'koa';

const allowMethods = ['GET', 'HEAD', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'].join(',');
const allowHeaders = ['Content-Type', 'Authorization'/*, 'Set-Cookie', 'Cookie' */].join(',');

export default () => async (ctx: Context, next: Next) => {
  const origin = ctx.get('Origin');
  ctx.vary('Origin');

  if (!origin) return await next();

  ctx.set('Access-Control-Allow-Origin', origin);
  ctx.set('Access-Control-Allow-Credentials', 'true');

  if (ctx.method !== 'OPTIONS') {
    return await next().catch((err) => {
      if (err.headers === null) err.headers = {};
      err.headers['Access-Control-Allow-Origin'] = origin;
      err.headers['Access-Control-Allow-Credentials'] = 'true';
      throw err;
    });
  }
  ctx.set('Access-Control-Allow-Methods', allowMethods);
  ctx.set('Access-Control-Allow-Headers', allowHeaders);

  ctx.status = 204;
};

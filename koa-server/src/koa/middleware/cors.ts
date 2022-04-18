import { Context, Next } from 'koa';

export default () => {
  const defaultOptions = {
    allowMethods: ['GET', 'HEAD', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
    allowHeaders: ['Content-Type', 'Set-Cookie', 'Cookie', 'Authorization',
      // 'Sec-Fetch-Dest',
      // 'Sec-Fetch-Mode',
      // 'Sec-Fetch-Site',
      'Tus-Resumable',
      'Upload-Length',
      'Upload-Metadata'
    ]
  };

  return async (ctx: Context, next: Next) => {
    const origin = ctx.get('Origin');
    ctx.vary('Origin');

    if (!origin) {
      await next();
      return;
    }

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

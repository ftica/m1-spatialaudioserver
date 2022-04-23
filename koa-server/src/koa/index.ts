import Koa from 'koa';

import middleware from './middleware';
import router from '../api';

declare module 'koa' {
  // eslint-disable-next-line no-unused-vars
  interface Context {
    request: Koa.Request;
    params: any;
  }
}

if (process.env.NODE_ENV === 'development') {
  router.get('/', ctx => {
    ctx.body = router.stack
      .filter(route => route.opts.end)
      .map(route => `${route.methods} ${route.path}`);
  });
}

const app = new Koa();

app.proxy = true;
app.keys = [
  'mach1-cookie-key-1',
  'mach1-cookie-key-2',
  'mach1-cookie-key-3'
];

app.use(middleware());

app.use(router.routes());
app.use(router.allowedMethods());

export default app;

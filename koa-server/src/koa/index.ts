import Koa from 'koa';

import middleware from './middleware';
import router from '../api';
import { PrismaClient } from '@prisma/client';
import { Token } from '../api/services/jwt-service';

declare module 'koa' {
  // eslint-disable-next-line no-unused-vars
  interface Context {
    prisma: PrismaClient;
    request: Koa.Request;
    params: any;
    token?: Token;
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

import Koa from 'koa';

import middleware from './middleware';
import router from '../api/router';
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

const app = new Koa();

app.keys = ['test'];
app.proxy = true;

app.use(middleware());

app.use(router.routes());
app.use(router.allowedMethods());

if (process.env.NODE_ENV === 'development') {
  router.get('/', ctx => {
    ctx.body = router.stack
      .filter(route => route.opts.end)
      .map(route => `${route.methods} ${route.path}`);
  });
}

export default app;

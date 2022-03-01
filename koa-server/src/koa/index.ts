import Koa from 'koa';

import middleware from './middleware';
import router from '../api/router';

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

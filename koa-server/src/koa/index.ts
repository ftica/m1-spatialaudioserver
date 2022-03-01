import Koa from 'koa';

import middleware from './middleware';
import router from '../api/router';

const server: Koa = new Koa();

server.keys = ['test'];
server.proxy = true;

server.use(middleware(server));

server.use(router.routes());
server.use(router.allowedMethods());

if (process.env.NODE_ENV === 'development') {
  router.get('/', ctx => {
    ctx.body = router.stack
      .filter(route => route.opts.end)
      .map(route => `${route.methods} ${route.path}`);
  });
}

export default server;

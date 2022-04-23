import Koa from 'koa';
import path from 'path';

import logger from 'koa-logger';
import bodyParser from 'koa-bodyparser';
import serve from 'koa-static';

import cors from './middleware/cors';
import errors from './middleware/errors';
import database from './middleware/database';
import tokenParser from './middleware/token-parser';
import multipartParser from './middleware/multipart-parser';

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

export default new Koa({
  proxy: true,
  keys: [
    'mach1-cookie-key-1',
    'mach1-cookie-key-2',
    'mach1-cookie-key-3'
  ]
})
  .use(logger())
  .use(cors())
  .use(errors())
  .use(database())
  .use(tokenParser())
  .use(multipartParser())
  .use(bodyParser({
    enableTypes: ['json', 'text', 'form', 'multipart-form'],
    onerror: (err, ctx) => ctx.throw(400, err.message)
  }))
  .use(serve(path.join(__dirname, '../../public')))
  .use(router.routes())
  .use(router.allowedMethods());

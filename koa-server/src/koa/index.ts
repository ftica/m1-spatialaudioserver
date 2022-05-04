import Koa from 'koa';
import path from 'path';

import logger from 'koa-logger';
import cors from '@koa/cors';
import bodyParser from 'koa-bodyparser';
import serve from 'koa-static';

import errors from './middleware/errors';
import tokenParser from './middleware/token-parser';
// import multipartParser from './middleware/multipart-parser';

import api from '../api';

declare module 'koa' {
  // eslint-disable-next-line no-unused-vars
  interface Context {
    request: Koa.Request;
    params: any;
  }
}

if (process.env.NODE_ENV === 'development') {
  api.get('/', ctx => {
    ctx.body = api.stack
      .filter(route => route.opts.end)
      .map(route => `${route.methods} ${route.path}`);
  });
}

export default new Koa({ proxy: true })
  .use(logger())
  .use(errors())
  .use(cors())
  .use(tokenParser())
  // .use(multipartParser())
  .use(bodyParser({
    enableTypes: ['json', 'text', 'form', 'multipart-form'],
    onerror: (err, ctx) => ctx.throw(400, err.message)
  }))
  .use(serve(path.join(__dirname, '../../public')))
  .use(api.routes())
  .use(api.allowedMethods());

import Koa from 'koa';

import logger from 'koa-logger';
import cors from '@koa/cors';
import bodyParser from 'koa-bodyparser';
// import serve from 'koa-static';
import compress from 'koa-compress';

import errors from './middleware/errors';
import tokenParser from './middleware/token-parser';

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
  .use(bodyParser({
    enableTypes: ['json', 'text', 'form', 'multipart-form'],
    onerror: (err, ctx) => ctx.throw(400, err.message)
  }))
  .use(compress({
    filter: mimeType => mimeType === 'application/x-mpegURL',
    threshold: 2048,
    gzip: { flush: require('zlib').constants.Z_SYNC_FLUSH },
    deflate: { flush: require('zlib').constants.Z_SYNC_FLUSH },
    br: false // disable brotli
  }))
  // .use(serve(publicFolderPath))
  .use(api.routes())
  .use(api.allowedMethods());

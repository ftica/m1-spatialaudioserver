import path from 'path';

import compose from 'koa-compose';
import logger from 'koa-logger';
import bodyparser from 'koa-bodyparser';
import serve from 'koa-static';
// import session from 'koa-session';

// import cors from './cors';
import errors from './errors';
import tokenParser from './token-parser';
import database from './database';

const staticDir = path.join(__dirname, '../../..', 'public');

export default () => compose([
  logger(),
  // cors(),
  errors(),
  database(),
  tokenParser(),
  bodyparser({
    enableTypes: ['json', 'text'],
    onerror: (err, ctx) => {
      ctx.status = 400;
      ctx.body = err.message;
    }
  }),
  serve(staticDir)
]);

import path from 'path';

import compose from 'koa-compose';
import logger from 'koa-logger';
import bodyParser from 'koa-bodyparser';
import serve from 'koa-static';
// import session from 'koa-session';

// import cors from './cors';
import errors from './errors';
import database from './database';
import tokenParser from './token-parser';

const staticDir = path.join(__dirname, '../../..', 'public');

export default () => compose([
  logger(),
  // cors(),
  errors(),
  database(),
  tokenParser(),
  bodyParser({
    enableTypes: ['json', 'text'],
    onerror: (err, ctx) => ctx.throw(400, err.message)
  }),
  serve(staticDir)
]);

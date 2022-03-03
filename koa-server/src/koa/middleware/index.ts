import path from 'path';

import compose from 'koa-compose';
import logger from 'koa-logger';
import bodyparser from 'koa-bodyparser';
import serve from 'koa-static';
// import session from 'koa-session';
// import { koa as validator } from 'node-input-validator';

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
  bodyparser(),
  // @ts-ignore
  // validator(),
  serve(staticDir)
]);

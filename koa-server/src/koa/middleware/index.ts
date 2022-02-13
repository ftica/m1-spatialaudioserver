import * as path from 'path';

import compose from 'koa-compose';

import bodyparser from 'koa-bodyparser';
import logger from 'koa-logger';
import serve from 'koa-static';
// import session from 'koa-session';
import * as validator from 'node-input-validator';

import cors from './cors';
import errors from './errors';
import tokenParser from './token-parser';
import database from './database';

const dirServe = path.join(__dirname, '../..', 'www');

export default function middleware(application) {
  const dependencies = [
    logger(),
    cors(),
    errors(),
    database(),
    tokenParser(),
    // session(application),
    bodyparser(),
    validator.koa(),
    serve(dirServe)
  ];

  return compose(dependencies);
}

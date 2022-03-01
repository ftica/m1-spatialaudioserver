import * as path from 'path';

import compose from 'koa-compose';

import { Context, Request } from 'koa';

import logger from 'koa-logger';
import bodyparser from 'koa-bodyparser';
import serve from 'koa-static';
// import session from 'koa-session';
import validator from 'node-input-validator';
import { PrismaClient } from '@prisma/client';

// import cors from './cors';
import errors from './errors';
import tokenParser from './token-parser';
import database from './database';

export type CustomRequest = Request & { body?: any }
export type CustomContext = Context & { prisma: PrismaClient; request: CustomRequest }

const dirServe = path.join(__dirname, '../..', 'www');

export default (_app) => {
  return compose([
    logger(),
    // cors(),
    errors(),
    database(),
    tokenParser(),
    bodyparser(),
    validator.koa(),
    serve(dirServe)
  ]);
};

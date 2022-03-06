import { PrismaClient } from '@prisma/client';
import { Request, Context } from 'koa';
import { Token } from '../api/services/jwt-service';
// import { Validator } from 'node-input-validator';

export type CustomContext = Context & {
  prisma: PrismaClient;
  request: Request;
  params: any;
  token?: Token;
}

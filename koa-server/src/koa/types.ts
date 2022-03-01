import { PrismaClient } from '@prisma/client';
import { Request, Context } from 'koa';
import { Token } from '../api/services/jwt-service';
import { Validator } from 'node-input-validator';

export type CustomRequest = Request;
export type CustomContext =
  Context
  & { prisma: PrismaClient; request: CustomRequest }
  & { token?: Token }
  & { validate?: Function, validator?: Validator };

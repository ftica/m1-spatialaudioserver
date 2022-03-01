import { PrismaClient } from '@prisma/client';
import { Request, Context } from 'koa';
import { JwtToken } from '../api/services/jwt-service';
import { Validator } from 'node-input-validator';

export type CustomRequest = Request;
export type CustomContext =
  Context
  & { prisma: PrismaClient; request: CustomRequest }
  & { token?: JwtToken }
  & { validate?: Function, validator?: Validator };

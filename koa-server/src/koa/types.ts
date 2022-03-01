import { PrismaClient } from '@prisma/client';
import { Request, Context } from 'koa';
import { JwtToken } from '../api/services/jwt';
import { Validator } from 'node-input-validator';

export type CustomRequest = Request & { token?: JwtToken } & { validate?: Function, validator?: Validator }
export type CustomContext = Context & { prisma: PrismaClient; request: CustomRequest }
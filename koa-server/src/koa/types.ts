import { PrismaClient } from '@prisma/client';
import { Request, Context } from 'koa';

export type CustomRequest = Request & { body?: any }
export type CustomContext = Context & { prisma: PrismaClient; request: CustomRequest }

import { PrismaClient } from '@prisma/client';
import { Context, Next } from 'koa';

declare module 'koa' {
  // eslint-disable-next-line no-unused-vars
  interface Context {
    prisma: PrismaClient;
  }
}

const prisma = new PrismaClient();

export default () => async (ctx: Context, next: Next) => {
  ctx.prisma = prisma;
  await next();
};

import { PrismaClient } from '@prisma/client';
import { Context, Next } from 'koa';

const prisma = new PrismaClient();

export default () => async (ctx: Context, next: Next) => {
  ctx.prisma = prisma;
  await next();
};

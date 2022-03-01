import { PrismaClient } from '@prisma/client';
import { Next } from 'koa';
import { CustomContext } from '.';

const prisma = new PrismaClient();

export default () => async (ctx: CustomContext, next: Next) => {
  ctx.prisma = prisma;
  return next();
};

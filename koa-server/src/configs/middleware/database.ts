import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export default () => async (ctx, next) => {
  ctx.prisma = prisma;
  return next();
};

import { PrismaClient } from '@prisma/client';

export default (new PrismaClient() as PrismaClient & { [_: string]: any });

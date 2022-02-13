// export const getAll = (prisma: PrismaClient)

import { Prisma, PrismaClient, Role } from '@prisma/client';

const DEFAULT_USER_SELECT: Prisma.UserFindManyArgs = {
  select: {
    id: true,
    username: true,
    password: false,
    role: true
  }
};

export type UserOut = {
  id: string,
  username: string,
  role: Role
};

const list = async (prisma: PrismaClient): Promise<UserOut[]> => await prisma.user.findMany(DEFAULT_USER_SELECT);

export const UserService = {
  list
};

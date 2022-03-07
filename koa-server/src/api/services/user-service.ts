import { PrismaClient, User } from '@prisma/client';
import Service from './service';

export class UserService extends Service<User> {
  async getByUsername(prisma: PrismaClient, username: string): Promise<User> {
    return await prisma[this.table].findUnique({ where: { id: undefined, username } });
  }

  override async update(prisma: PrismaClient, username: string, data): Promise<User> {
    return await prisma[this.table].update({ where: { username }, data });
  }

  override async delete(prisma: PrismaClient, username: string): Promise<User> {
    return await prisma[this.table].delete({ where: { username } });
  }
}

export default new UserService('user');

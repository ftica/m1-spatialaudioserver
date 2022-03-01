import { PrismaClient, User } from '@prisma/client';
import Service from './service';

class UserService extends Service<User> {
  async getByUsername(prisma: PrismaClient, username: string): Promise<User> {
    return await prisma[this.table].findUnique({ where: { id: undefined, username } });
  }

  override async update(prisma: PrismaClient, username: string, data): Promise<User> {
    try {
      return await prisma[this.table].update({ where: { username }, data });
    } catch (err) {
      return null;
    }
  }

  override async delete(prisma: PrismaClient, username: string): Promise<User> {
    try {
      return await prisma[this.table].delete({ where: { username } });
    } catch (err) {
      return null;
    }
  }
}

export default new UserService('user');

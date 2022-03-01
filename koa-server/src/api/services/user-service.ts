import { Prisma, User } from '@prisma/client';
import Service from './service';

class UserService extends Service<User> {
  async getByUsername(table: Prisma.UserDelegate<any>, username: string): Promise<User> {
    return await table.findUnique({ where: { id: undefined, username } });
  }

  override async update(table, username: string, data): Promise<User> {
    try {
      return await table.update({ where: { username }, data });
    } catch (err) {
      return null;
    }
  }

  override async delete(table, username: string): Promise<User> {
    try {
      return await table.delete({ where: { username } });
    } catch (err) {
      return null;
    }
  }
}

export default new UserService();

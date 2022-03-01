import { User } from '@prisma/client';
import Service from './service';

class UserService extends Service<User> {

  async getByUsername(table, username: string): Promise<User> {
    return await table.findUnique({ where: username });
  }

  override async update(table, username: string, data): Promise<User> {
    return await table.update({ where: { username }, data });
  }

  override async delete(table, username: string): Promise<User> {
    return await table.delete({ where: { username } });
  }

}

export default new UserService();

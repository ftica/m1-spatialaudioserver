import { Prisma, User } from '@prisma/client';
import ModelService from './model-service';

export class UserService extends ModelService<User, Prisma.UserDelegate<Prisma.RejectOnNotFound | Prisma.RejectPerOperation>> {
  async findByEmail(email: string, select?: any): Promise<any> {
    return await super.findUnique({ email }, select);
  }

  async findByUsername(username: string, select?: any): Promise<any> {
    return await super.findUnique({ username }, select);
  }

  async updateByUsername(username: string, data: any, select?: any): Promise<any> {
    return await super.updateOne({ username }, data, select);
  }

  async deleteByUsername(username: string, select?: any): Promise<any> {
    return await super.deleteOne({ username }, select);
  }

  async seenNow(username: string): Promise<string> {
    return await this.updateByUsername(username, { lastSeen: new Date() }, { id: true });
  }
}

export default new UserService('user');

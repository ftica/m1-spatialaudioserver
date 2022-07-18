import { User } from '@prisma/client';
import db from '../../koa/db';
import ModelService from './model-service';

export class UserService extends ModelService<User, typeof db.user> {
  async findByEmail(email: string, select?: any): Promise<any> {
    return await this.findUnique({ email }, select);
  }

  async findByUsername(username: string, select?: any): Promise<any> {
    return await this.findUnique({ username }, select);
  }

  async updateByUsername(username: string, data: any, select?: any): Promise<any> {
    return await this.updateOne({ username }, data, select);
  }

  async deleteByUsername(username: string, select?: any): Promise<any> {
    return await this.deleteOne({ username }, select);
  }

  async seenNow(username: string): Promise<string> {
    return await this.updateByUsername(username, { lastSeen: new Date() }, { id: true });
  }
}

export default new UserService('user');

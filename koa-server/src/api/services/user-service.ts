import { User } from '@prisma/client';
import encryptionService from './encryption-service';
import ModelService from './model-service';

export class UserService extends ModelService<User> {
  async findByEmail(email: string, select: any = undefined): Promise<any> {
    return await super.findUnique({ id: undefined, email }, select);
  }

  async findByUsername(username: string, select: any = undefined): Promise<any> {
    return await super.findUnique({ id: undefined, username }, select);
  }

  async updateByUsername(username: string, data: any, select: any = undefined): Promise<any> {
    return await super.updateOne({ id: undefined, username }, data, select);
  }

  async deleteByUsername(username: string, select: any = undefined): Promise<any> {
    return await super.deleteOne({ id: undefined, username }, select);
  }

  override async createOne(data: User, select?: any): Promise<any> {
    data.password = await encryptionService.digest(data.password);
    return await super.createOne(data, select);
  }
}

export default new UserService('user');

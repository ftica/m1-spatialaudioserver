import { User } from '@prisma/client';
import { Context } from 'koa';
import ModelService from './model-service';

export class UserService extends ModelService<User> {
  async findByUsername(ctx: Context, username: string, select: any = undefined): Promise<any> {
    return await super.findOne(ctx, { id: undefined, username }, select);
  }

  async updateByUsername(ctx: Context, username: string, data: any, select: any = undefined): Promise<any> {
    return await super.updateOne(ctx, { id: undefined, username }, data, select);
  }

  async deleteByUsername(ctx: Context, username: string, select: any = undefined): Promise<any> {
    return await super.deleteOne(ctx, { id: undefined, username }, select);
  }
}

export default new UserService('user');

import { User } from '@prisma/client';
import { Context } from 'koa';
import encryptionService, { EncryptionService } from './encryption-service';
import ModelService from './model-service';

export class UserService extends ModelService<User> {
  constructor(
    protected readonly table: string,
    private readonly encryptionService: EncryptionService
  ) {
    super(table);
  }

  async findByEmail(ctx: Context, email: string, select: any = undefined): Promise<any> {
    return await super.findOne(ctx, { id: undefined, email }, select);
  }

  async findByUsername(ctx: Context, username: string, select: any = undefined): Promise<any> {
    return await super.findOne(ctx, { id: undefined, username }, select);
  }

  async updateByUsername(ctx: Context, username: string, data: any, select: any = undefined): Promise<any> {
    return await super.updateOne(ctx, { id: undefined, username }, data, select);
  }

  async deleteByUsername(ctx: Context, username: string, select: any = undefined): Promise<any> {
    return await super.deleteOne(ctx, { id: undefined, username }, select);
  }

  override async createOne(ctx: Context, data: User, select?: any): Promise<any> {
    data.password = await this.encryptionService.digest(data.password);
    return await super.createOne(ctx, data, select);
  }
}

export default new UserService('user', encryptionService);

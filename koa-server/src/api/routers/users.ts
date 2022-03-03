import Router from '@koa/router';
import { DefaultState } from 'koa';
import { User } from '@prisma/client';
import { CustomContext } from '../../koa/types';
import ModelEndpoint from './model-endpoint';
import userService, { UserService } from '../services/user-service';

class Users extends ModelEndpoint<User, UserService> {
  async getByUsername(ctx: CustomContext) {
    const username: string = ctx.params.username;
    const user = await this.service.getByUsername(ctx.prisma, username);
    if (user === null) {
      ctx.status = 404;
    } else {
      ctx.body = user;
    }
  }

  async update(ctx: CustomContext) {
    const username: string = ctx.params.username;
    const data: User = ctx.request.body;
    const user = await this.service.update(ctx.prisma, username, data);
    if (user == null) {
      ctx.status = 404;
    } else {
      ctx.body = user;
    }
  }

  async del(ctx: CustomContext) {
    const username: string = ctx.params.username;
    const user = await this.service.delete(ctx.prisma, username);
    if (user == null) {
      ctx.status = 404;
    } else {
      ctx.body = user;
    }
  }

  async profile(ctx: CustomContext) {
    if (ctx.token) {
      ctx.body = ctx.token?.username;
    } else {
      ctx.status = 404;
    }
  }

  async setActive(ctx: CustomContext) {
    const id: string = ctx.params.id;
    const active: boolean = ctx.request.body.active;

    const user = await this.service.update(ctx.prisma, id, { active });
    ctx.body = user;
  }
}

const users = new Users(userService);

export default new Router<DefaultState, CustomContext>()
  .get('/', users.getAll.bind(users))
  .get('/count', users.count.bind(users))
  .get('/profile', users.profile.bind(users))
  .get('/:username', users.getByUsername.bind(users))
  .put('/:username', users.update.bind(users))
  .del('/:username', users.del.bind(users))
  .patch('/:username/active', users.setActive.bind(users));

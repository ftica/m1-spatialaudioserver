import Router from '@koa/router';
import { DefaultState } from 'koa';
import { User } from '@prisma/client';
import { validate } from '../validation';
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

  async create(ctx: CustomContext) {
    const data: User = {
      id: undefined,
      username: ctx.request.body.username,
      password: ctx.request.body.password,
      role: ctx.request.body.role
    };

    // TODO: if current user not admin?
    // delete data.role;

    const errors = await validate(data, {
      username: 'required|minLength:2|maxLength:20', // TODO: "profile" and "count" are reserved because /users/:username wouldn't map to getById when querying for that user
      password: 'required|minLength:5|maxLength:255'
    });

    if (errors) {
      ctx.status = 400;
      ctx.body = { errors };
      return;
    }

    const user = await this.service.create(ctx.prisma, data);

    delete user.password;

    ctx.body = user;
  }

  async profile(ctx: CustomContext) {
    ctx.body = 'profile';
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
  .post('/', users.create.bind(users))
  .put('/:username', users.update.bind(users))
  .del('/:username', users.del.bind(users))
  .patch('/:username/active', users.setActive.bind(users));

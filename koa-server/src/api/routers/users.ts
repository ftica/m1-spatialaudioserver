import Router from '@koa/router';
import { DefaultState } from 'koa';
import { User } from '@prisma/client';
import userService from '../services/user-service';
import { validate } from '../validation';
import { CustomContext } from '../../koa/types';
import Endpoint from './endpoint';

class Users extends Endpoint<User> {
  async getByUsername(ctx: CustomContext) {
    const username: string = ctx.params.username;
    const user = await userService.getByUsername(ctx.prisma, username);
    if (user === null) {
      ctx.status = 404;
    } else {
      ctx.body = user;
    }
  }

  async update(ctx: CustomContext) {
    const username: string = ctx.params.username;
    const data: User = ctx.request.body;
    const user = await userService.update(ctx.prisma, username, data);
    if (user == null) {
      ctx.status = 404;
    } else {
      ctx.body = user;
    }
  }

  async del(ctx: CustomContext) {
    const username: string = ctx.params.username;
    const user = await userService.delete(ctx.prisma, username);
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

    const user = await userService.create(ctx.prisma, data);

    delete user.password;

    ctx.body = user;
  }

  async profile(ctx: CustomContext) {
    ctx.body = 'profile';
  }

  async setActive(ctx: CustomContext) {
    const id: string = ctx.params.id;
    const active: boolean = ctx.request.body.active;

    const user = await userService.update(ctx.prisma, id, { active });
    ctx.body = user;
  }
}

const users = new Users(userService);

export default new Router<DefaultState, CustomContext>()
  .get('/', users.getAll)
  .get('/count', users.count)
  .get('/profile', users.profile)
  .get('/:username', users.getByUsername)
  .post('/', users.create)
  .put('/:username', users.update)
  .del('/:username', users.del)
  .patch('/:username/active', users.setActive);

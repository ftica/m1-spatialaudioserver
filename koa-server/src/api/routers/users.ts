import Router from '@koa/router';
import { Context, DefaultState } from 'koa';
import { Role, User } from '@prisma/client';
import ModelEndpoint from './model-endpoint';
import userService, { UserService } from '../services/user-service';
import validate, { Valid } from '../validator';
import Joi from 'joi';

class Users extends ModelEndpoint<User, UserService> {
  static readonly validUsername = Joi.string().min(4).max(20).required();
  static readonly validRole = Joi.string().valid(Role.USER, Role.ADMIN).required();

  static readonly validUsernameParam = Joi.object({ username: this.validUsername });

  async getByUsername(ctx: Context) {
    const user = await this.service.getByUsername(ctx.prisma, ctx.params.username);
    if (user === null) ctx.status = 404;
    else ctx.body = user;
  }

  async del(ctx: Context) {
    const user = await this.service.delete(ctx.prisma, ctx.params.username);
    if (user == null) ctx.status = 404;
    else ctx.body = user;
  }

  async profile(ctx: Context) {
    if (ctx.token) {
      ctx.body = ctx.token?.username;
    } else {
      ctx.status = 404;
    }
  }

  async updateUsername(ctx: Context) {
    const user = await this.service.update(ctx.prisma, ctx.params.username, { username: ctx.request.body });
    if (user === null) ctx.status = 404;
    else ctx.body = user;
  }

  async updateRole(ctx: Context) {
    const user = await this.service.update(ctx.prisma, ctx.params.username, { role: ctx.request.body });
    if (user === null) ctx.status = 404;
    else ctx.body = user;
  }

  async updateActive(ctx: Context) {
    const user = await this.service.update(ctx.prisma, ctx.params.username, { active: ctx.request.body === 'true' });
    if (user === null) ctx.status = 404;
    else ctx.body = user;
  }
}

const users = new Users(userService);

export default new Router<DefaultState, Context>()
  .get('/', users.getAll.bind(users))
  .get('/count', users.count.bind(users))
  .get('/profile', users.profile.bind(users))
  .get('/:username', validate(Users.validUsernameParam), users.getByUsername.bind(users))
  .del('/:username', validate(Users.validUsernameParam), users.del.bind(users))
  .patch('/:username/username', validate(Users.validUsernameParam, Users.validUsername), users.updateUsername.bind(users))
  .patch('/:username/role', validate(Users.validUsernameParam, Users.validRole), users.updateRole.bind(users))
  .patch('/:username/active', validate(Users.validUsernameParam, Valid.bool), users.updateActive.bind(users));

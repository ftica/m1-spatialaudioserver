import Router from '@koa/router';
import { Context, DefaultState } from 'koa';
import { Role, User } from '@prisma/client';
import ModelEndpoint from './model-endpoint';
import userService, { UserService } from '../services/user-service';
import { Valid } from '../validator';
import Joi from 'joi';
import { Authorize, NotFound, Validate } from '../decorators';

class Users extends ModelEndpoint<User, UserService> {
  static readonly validUsername = Joi.string().min(4).max(20).required();
  static readonly validRole = Joi.string().valid(Role.USER, Role.ADMIN).required();

  static readonly validUsernameParam = Joi.object({ username: this.validUsername });

  @Authorize(Role.USER)
  @Validate(Users.validUsernameParam)
  @NotFound
  async getByUsername(ctx: Context) {
    return await this.service.getByUsername(ctx.prisma, ctx.params.username);
  }

  @Authorize(Role.ADMIN)
  @Validate(Users.validUsernameParam)
  @NotFound
  async del(ctx: Context) {
    return await this.service.delete(ctx.prisma, ctx.params.username);
  }

  @Authorize(Role.USER)
  async profile(ctx: Context) {
    ctx.body = 'Profile of current session user';
  }

  @Authorize(Role.USER)
  @Validate(Users.validUsernameParam, Users.validUsername)
  @NotFound
  async updateUsername(ctx: Context) {
    return await this.service.update(ctx.prisma, ctx.params.username, { username: ctx.request.body });
  }

  @Authorize(Role.ADMIN)
  @Validate(Users.validUsernameParam, Users.validRole)
  @NotFound
  async updateRole(ctx: Context) {
    return await this.service.update(ctx.prisma, ctx.params.username, { role: ctx.request.body });
  }

  @Authorize(Role.USER)
  @Validate(Users.validUsernameParam, Valid.bool)
  @NotFound
  async updateActive(ctx: Context) {
    return await this.service.update(ctx.prisma, ctx.params.username, { active: ctx.request.body === 'true' });
  }
}

const users = new Users(userService);

export default new Router<DefaultState, Context>()
  .get('/', users.getAll.bind(users))
  .get('/count', users.count.bind(users))
  .get('/profile', users.profile.bind(users))
  .get('/:username', users.getByUsername.bind(users))
  .del('/:username', users.del.bind(users))
  .patch('/:username/username', users.updateUsername.bind(users))
  .patch('/:username/role', users.updateRole.bind(users))
  .patch('/:username/active', users.updateActive.bind(users));

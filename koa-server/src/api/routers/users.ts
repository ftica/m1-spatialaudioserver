import Router from '@koa/router';
import { Context, DefaultState } from 'koa';
import { User } from '@prisma/client';
import userService from '../services/user-service';

const getAll = async ctx => {
  const users: User[] = await userService.getAll(ctx.prisma.user);
  ctx.body = users;
};

const getByUsername = async ctx => {
  const username: string = ctx.params.username;
  const user: User = await userService.getByUsername(ctx.prisma.user, username);
  ctx.body = user;
}

const update = async ctx => {
  const username: string = ctx.params.username;
  const data: User = ctx.request.body;
  const user: User = await userService.update(ctx.prisma.user, username, data);
  ctx.body = user;
}

const del = async ctx => {
  const username: string = ctx.params.username;
  const user: User = await userService.delete(ctx.prisma.user, username);
  ctx.body = user;
}

const create = async ctx => {
  const data: User = ctx.request.body;

  // const errors: string[] = validate(data);
  // if(errors) {
  //   ctx.status = 400;
  //   ctx.body = { errors }
  // }

  const user: User = await userService.create(ctx.prisma.user, data);
  ctx.body = user;
}

const profile = async ctx => {
  
}

const setActive = async ctx => {
  const id: string = ctx.params.id;
  const active: boolean = ctx.request.body.active;

  const user: User = await userService.update(ctx.prisma.user, id, { active });
  ctx.body = user;
}

export default new Router<DefaultState, Context>()
  .get('/', getAll)
  .get('/profile', profile)
  .get('/:username', getByUsername)
  .post('/', create)
  .del('/:username', del)
  .patch('/:username/active', setActive);
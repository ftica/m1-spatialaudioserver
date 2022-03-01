import Router from '@koa/router';
import { DefaultState } from 'koa';
import { User } from '@prisma/client';
import userService from '../services/user-service';
import { validate } from '../validation';
import { CustomContext } from '../../koa/types';

const getAll = async (ctx: CustomContext) => {
  const users = await userService.getAll(ctx.prisma.user);
  ctx.body = users;
};

const getByUsername = async (ctx: CustomContext) => {
  const username: string = ctx.params.username;
  const user = await userService.getByUsername(ctx.prisma.user, username);
  if (user === null) {
    ctx.status = 404;
  } else {
    ctx.body = user;
  }
};

const update = async (ctx: CustomContext) => {
  const username: string = ctx.params.username;
  const data: User = ctx.request.body;
  const user = await userService.update(ctx.prisma.user, username, data);
  if (user == null) {
    ctx.status = 404;
  } else {
    ctx.body = user;
  }
};

const del = async (ctx: CustomContext) => {
  const username: string = ctx.params.username;
  const user = await userService.delete(ctx.prisma.user, username);
  if (user == null) {
    ctx.status = 404;
  } else {
    ctx.body = user;
  }
};

const create = async (ctx: CustomContext) => {
  const data: User = {
    id: undefined,
    username: ctx.request.body.username,
    password: ctx.request.body.password,
    role: ctx.request.body.role
  };

  // TODO: if current user not admin?
  // delete data.role;

  // const parsedData: User = {
  //   username: data.username,
  //   password: data.password,
  // }

  const errors = await validate(data, {
    username: 'required|minLength:2|maxLength:20', // TODO: "profile" and "count" are reserved because /users/:username wouldn't map to getById when querying for that user
    password: 'required|minLength:5|maxLength:255'
  });

  console.log(errors);

  if (errors) {
    ctx.status = 400;
    ctx.body = { errors };
    return;
  }

  // const validator = new Validator(data, {
  //   username: "required|minLength:2",
  //   password: "required|minLength:8",
  //   // email: "required|email"
  // });

  // if(!await validator.check()) {
  //   ctx.status = 400;
  //   ctx.body = { errors: validator.errors }
  //   return;
  // }

  const user = await userService.create(ctx.prisma.user, data);

  delete user.password;

  ctx.body = user;
};

const profile = async ctx => {
  ctx.body = 'profile';
};

const setActive = async ctx => {
  const id: string = ctx.params.id;
  const active: boolean = ctx.request.body.active;

  const user = await userService.update(ctx.prisma.user, id, { active });
  ctx.body = user;
};

const getCount = async ctx => {
  console.log('num');
  const num = await userService.count(ctx.prisma.user);
  console.log(num);
  ctx.body = num;
};

export default new Router<DefaultState, CustomContext>()
  .get('/', getAll)
  .get('/count', getCount)
  .get('/profile', profile)
  .get('/:username', getByUsername)
  .post('/', create)
  .put('/:username', update)
  .del('/:username', del)
  .patch('/:username/active', setActive);

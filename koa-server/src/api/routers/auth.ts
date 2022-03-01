import Router from '@koa/router';
// import * as Router from '@koa/router';
// import service from './services/encryption';
// import * as Router from 'koa-router';
import { AuthService, UserLoginInput, UserRegisterInput } from '../services/auth-service';
// import { ROLE_ADMIN, ROLE_USER } from '../../auth/auth-utils';
import { DefaultState } from 'koa';
import { CustomContext } from '../../koa/types';

/**
 * Authenticating user by login (it can be nickname for email) and password;
 * if login success adding user profile into session
 * @param  {Object}  ctx  the default koa context whose encapsulates
 *                          node's request and response objects into a single object
 */
// async function login(ctx) {
//   const {
//     body: {
//       login,
//       password
//     }
//   } = ctx.request;
//
//   const id = await ctx.redis.hget('users:lookup:all', login);
//   if (_.isNull(id)) ctx.throw(404, 'User with such credentials was not found');
//
//   const user = await ctx.redis.hgetall(`user:${id}`);
//   const isValid = await service.validate(password, user.hash, user.salt);
//
//   if (!isValid) ctx.throw(401, 'Incorrect login or password');
//
//   ctx.session.user = _.pick(user, new UserModel().keys);
//
//   ctx.status = 201;
//   ctx.body = {
//     user: ctx.session.user
//   };
// }

// function getLoginHandler() {
//   const validInput = {
//     email: 'required|email',
//     password: 'required|minLength:8'
//   };
//
//   return async (ctx) => {
//     await ctx.validate(validInput);
//     const {
//       email,
//       password
//     } = ctx.request.body;
//
//     return { email, password };
//   };
// }

/**
 * Simple logout handler; Removing user sessions and redirect them to root
 * @param  {Object}  ctx  the default koa context whose encapsulates
 *                          node's request and response objects into a single object
 */
// async function logout(ctx) {
//   // TODO logout
//   ctx.session = null;
//   ctx.status = 204;
// }

// async function register(ctx) {
//   ctx.status = 200;
// }

function getRegisterHandler() {
  const validInput = {
    username: 'required',
    password: 'required|minLength:8'
  };

  return async (ctx) => {
    await ctx.validate(validInput);

    const input: UserRegisterInput = {
      username: ctx.request.body.username,
      password: ctx.request.body.password
    };

    const user = await AuthService.register(ctx.prisma, input);

    ctx.status = 200;

    return user;
  };
}

function getLoginHandler() {
  const validInput = {
    username: 'required',
    password: 'required'
  };

  return async (ctx) => {
    await ctx.validate(validInput);

    const input: UserLoginInput = {
      username: ctx.request.body.username,
      password: ctx.request.body.password
    };

    const accessToken = await AuthService.login(ctx.prisma, input);

    ctx.status = 200;
    ctx.body = accessToken;
  };
}

// function getChangeRoleHandler() {
//   const validInput = {
//     role: `required|in:${ROLE_ADMIN},${ROLE_USER}`
//   };

//   return async (ctx) => await ctx.validate(validInput);
// }

// async function validate(ctx, next) {
//   const { user } = ctx.session;
//
//   if (_.get(user, 'role') === 'admin') {
//     await next();
//   } else {
//     ctx.throw(401, 'Permission deny');
//   }
// }

export default new Router<DefaultState, CustomContext>()
  .post('/register', getRegisterHandler())
  .post('/login', getLoginHandler());
// .post('/login', login)
// .put('/:id', authenticated(), hasAnyRole(ROLE_ADMIN), getChangeRoleHandler())
// .del('/logout', authenticated(), logout);
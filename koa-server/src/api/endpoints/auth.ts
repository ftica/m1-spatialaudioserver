import Router from '@koa/router';
import Joi from 'joi';
import { Context, DefaultState } from 'koa';
import authService, { AuthService } from '../services/auth-service';
import { NotFound } from '../util/decorators/response';
import { Validate } from '../util/decorators/validation';
import { Valid } from '../util/valid';
import { Users } from './users';

export class Auth {
  constructor(
    private readonly authService: AuthService
  ) { }

  static readonly validRegister = Joi.object({
    username: Users.validUsername,
    email: Valid.email,
    password: Users.validPassword
  });

  static readonly validLogin = Joi.object({
    login: Valid.email,
    password: Users.validPassword
  });

  static readonly validLoginOAuth = Joi.object({
    grant_type: Joi.string(),
    client_id: Valid.email,
    client_secret: Users.validPassword
  });

  @Validate({ body: Auth.validRegister })
  @NotFound()
  async register(ctx: Context) {
    return await this.authService.register(ctx, {
      username: ctx.request.body.username,
      email: ctx.request.body.email,
      password: ctx.request.body.password
    });
  }

  @Validate({ body: Auth.validLogin })
  @NotFound(401)
  async login(ctx: Context) {
    return await this.authService.login(ctx, {
      email: ctx.request.body.login,
      password: ctx.request.body.password
    });
  }

  @Validate({ body: Auth.validLoginOAuth })
  @NotFound(401)
  async loginOAuth(ctx: Context) {
    return {
      token_type: 'bearer',
      access_token: await this.authService.login(ctx, {
        email: ctx.request.body.client_id,
        password: ctx.request.body.client_secret
      }),
      expires_in: 60 * 60 * 2
    };
  }
}

const auth = new Auth(authService);

export default new Router<DefaultState, Context>()
  .post('/register', auth.register.bind(auth))
  .post('/login', auth.login.bind(auth))
  .post('/login/oauth', auth.loginOAuth.bind(auth));

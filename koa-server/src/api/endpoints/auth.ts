import Joi from 'joi';
import { Context } from 'koa';
import authService, { AuthService } from '../services/auth-service';
import { NotFound } from '../util/decorators/response';
import { Valid, Validate } from '../util/decorators/validation';
import { Users } from './users';

export class Auth {
  static readonly validRegister = Joi.object({
    username: Users.validUsername,
    email: Valid.email.required(),
    password: Users.validPassword
  });

  static readonly validLogin = Joi.object({
    login: Valid.email.required(),
    password: Users.validPassword
  });

  static readonly validLoginOAuth = Joi.object({
    grant_type: Joi.string(),
    client_id: Valid.email.required(),
    client_secret: Users.validPassword
  });

  @Validate({ body: Auth.validRegister })
  @NotFound(412)
  async register(ctx: Context) {
    return await authService.register({
      username: ctx.request.body.username,
      email: ctx.request.body.email,
      password: ctx.request.body.password
    });
  }

  @Validate({ body: Auth.validLogin })
  @NotFound(401)
  async login(ctx: Context) {
    const token = await authService.login({
      email: ctx.request.body.login,
      password: ctx.request.body.password
    });

    if (!token) return null;

    return { token };
  }

  @Validate({ body: Auth.validLoginOAuth })
  @NotFound(401)
  async loginOAuth(ctx: Context) {
    const token = await authService.login({
      email: ctx.request.body.client_id,
      password: ctx.request.body.client_secret
    });

    if (!token) return null;

    return {
      access_token: token,
      token_type: 'Bearer',
      expires_in: AuthService.expiresInSeconds
    };
  }
}

export default new Auth();

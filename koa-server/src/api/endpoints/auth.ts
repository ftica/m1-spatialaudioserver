import Router from '@koa/router';
import Joi from 'joi';
import { Context, DefaultState } from 'koa';
import { NotFound, Validate } from '../util/decorators';
import authService, { AuthService } from '../services/auth-service';

class Auth {
  constructor(
    private readonly service: AuthService
  ) { }

  static readonly validUsername = Joi.string().min(4).max(30).required();
  static readonly validPassword = Joi.string().min(8).required();

  static readonly validRegister = Joi.object({
    username: this.validUsername,
    password: this.validPassword
  });

  static readonly validLogin = Joi.object({
    username: this.validUsername,
    password: this.validPassword
  });

  static readonly validLoginOAuth = Joi.object({
    grant_type: Joi.string(),
    client_id: this.validUsername,
    client_secret: this.validPassword
  });

  @Validate(null, Auth.validRegister)
  @NotFound()
  async register(ctx: Context) {
    return await this.service.register(ctx.prisma, {
      username: ctx.request.body.username,
      password: ctx.request.body.password
    });
  }

  @Validate(null, Auth.validLogin)
  @NotFound(401)
  async login(ctx: Context) {
    return await authService.login(ctx.prisma, {
      username: ctx.request.body.username,
      password: ctx.request.body.password
    });
  }

  @Validate(null, Auth.validLoginOAuth)
  @NotFound(401)
  async loginOAuth(ctx: Context) {
    return {
      token_type: 'bearer',
      access_token: await authService.login(ctx.prisma, {
        username: ctx.request.body.client_id,
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

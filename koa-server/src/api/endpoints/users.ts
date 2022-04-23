import Router from '@koa/router';
import { Context, DefaultState } from 'koa';
import Joi from 'joi';
import userService, { UserService } from '../services/user-service';
import { Valid } from '../util/valid';
import { AuthorizeAdmin, AuthorizeLogged, AuthorizeMe } from '../util/decorators/authorization';
import { NotFound, Ok } from '../util/decorators/response';
import { Validate } from '../util/decorators/validation';
import { Paginate } from '../util/decorators/request';

export class Users {
  constructor(
    protected readonly userService: UserService
  ) { }

  static readonly validUsername = Joi.string().min(4).max(60).required();
  static readonly validUsernameParam = Joi.object({ username: this.validUsername });
  static readonly validPassword = Joi.string().min(8).required();

  @AuthorizeLogged
  @Ok()
  async profile(ctx: Context) {
    return this.userService.findById(ctx, ctx.token.userId, {
      username: true,
      email: true,
      role: ctx.admin,
      playlists: {
        select: {
          id: true,
          name: true
        }
      },
      favorites: {
        select: {
          playlist: {
            select: {
              id: true,
              name: true
            }
          }
        }
      }
    });
  }

  @AuthorizeLogged
  @Validate({ params: Users.validUsernameParam })
  @NotFound()
  async findByUsername(ctx: Context) {
    return await this.userService.findByUsername(ctx, ctx.params.username, {
      username: true,
      email: ctx.admin,
      role: ctx.admin,
      lastSeen: true,
      playlists: {
        select: {
          id: true,
          name: true
        },
        where: {
          public: true
        }
      },
      favorites: ctx.admin && {
        select: {
          playlist: {
            select: {
              id: true,
              name: true
            }
          }
        }
      }
    });
  }

  @AuthorizeLogged
  @Validate({ params: Users.validUsernameParam })
  @Paginate()
  @NotFound()
  async findPlaylistsByUsername(ctx: Context) {
    return (await this.userService.findByUsername(ctx, ctx.params.username, {
      playlists: {
        skip: ctx.page * ctx.size,
        take: ctx.size,
        select: {
          id: true,
          name: true
        }
      }
    })).playlists;
  }

  @AuthorizeMe
  @Validate({ params: Users.validUsernameParam })
  @Paginate()
  @NotFound()
  async findFavoritesByUsername(ctx: Context) {
    return (await this.userService.findByUsername(ctx, ctx.params.username, {
      favorites: {
        skip: ctx.page * ctx.size,
        take: ctx.size,
        select: {
          playlist: {
            select: {
              id: true,
              name: true
            }
          }
        }
      }
    })).favorites;
  }

  @AuthorizeAdmin
  @Paginate()
  @Ok()
  async getAllPage(ctx: Context): Promise<any[]> {
    return await this.userService.findPage(ctx, undefined, {
      username: true,
      email: true,
      role: true,
      lastSeen: true
    });
  }

  @AuthorizeAdmin
  @Validate({
    body: Joi.object({
      username: Users.validUsername,
      email: Valid.email,
      password: Users.validPassword,
      role: Valid.role
    })
  })
  @Ok(201)
  async create(ctx: Context): Promise<any> {
    return await this.userService.createOne(ctx, {
      id: undefined,
      lastSeen: undefined,
      username: ctx.request.body.username,
      email: ctx.request.body.email,
      password: ctx.request.body.password,
      role: ctx.request.body.role
    }, {
      username: true,
      email: true,
      role: true
    });
  }

  @AuthorizeAdmin
  @Validate({ params: Users.validUsernameParam })
  @NotFound()
  async deleteByUsername(ctx: Context): Promise<any> {
    return await this.userService.deleteByUsername(ctx, ctx.params.username);
  }

  @AuthorizeAdmin
  @Validate({
    params: Users.validUsernameParam,
    body: Joi.object({
      username: Users.validUsername,
      email: Valid.email,
      role: Valid.role
    })
  })
  @NotFound()
  async update(ctx: Context) {
    return await this.userService.updateByUsername(ctx, ctx.params.username, {
      username: ctx.request.body.username,
      email: ctx.request.body.email,
      role: ctx.request.body.role
    }, {
      username: true,
      email: true,
      role: true
    });
  }

  @AuthorizeAdmin
  @Validate({ params: Users.validUsernameParam, body: Users.validUsername })
  @NotFound()
  async updateUsername(ctx: Context) {
    return await this.userService.updateByUsername(ctx, ctx.params.username, {
      username: ctx.request.body
    }, {
      username: true,
      email: true,
      role: true
    });
  }

  @AuthorizeMe
  @Validate({ params: Users.validUsernameParam, body: Valid.email.required() })
  @NotFound()
  async updateEmail(ctx: Context) {
    return await this.userService.updateByUsername(ctx, ctx.params.username, {
      email: ctx.request.body
    }, {
      username: true,
      email: true,
      role: true
    });
  }

  @AuthorizeAdmin
  @Validate({ params: Users.validUsernameParam, body: Valid.role.required() })
  @NotFound()
  async updateRole(ctx: Context) {
    return await this.userService.updateByUsername(ctx, ctx.params.username, {
      role: ctx.request.body
    }, {
      username: true,
      email: true,
      role: true
    });
  }
}

const users = new Users(userService);

export default new Router<DefaultState, Context>()
  .get('/', users.getAllPage.bind(users))
  .get('/me', users.profile.bind(users))
  .get('/:username', users.findByUsername.bind(users))
  .get('/:username/tracks', users.findPlaylistsByUsername.bind(users))
  .get('/:username/playlists', users.findPlaylistsByUsername.bind(users))
  .get('/:username/favorites', users.findFavoritesByUsername.bind(users))
  .post('/', users.create.bind(users))
  .del('/:username', users.deleteByUsername.bind(users))
  .put('/:username', users.update.bind(users))
  .patch('/:username/username', users.updateUsername.bind(users))
  .patch('/:username/email', users.updateEmail.bind(users))
  .patch('/:username/role', users.updateRole.bind(users));

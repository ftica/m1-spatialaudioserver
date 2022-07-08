import { Context } from 'koa';
import Joi from 'joi';
import userService from '../services/user-service';
import { AuthorizeAdmin, AuthorizeLogged, AuthorizeMe } from '../util/decorators/authorization';
import { NotFound, Ok } from '../util/decorators/response';
import { Valid, Validate } from '../util/decorators/validation';
import { Paginate } from '../util/decorators/request';

export class Users {
  static readonly validUsername = Joi.string().min(4).max(60).required();
  static readonly validUsernameParam = Joi.object({ username: this.validUsername });
  static readonly validPassword = Joi.string().min(8).required();

  @AuthorizeLogged
  @Ok()
  async profile(ctx: Context) {
    return userService.findById(ctx.token.userId, {
      id: true,
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
    return await userService.findByUsername(ctx.params.username, {
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
          isPublic: true
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
    return (await userService.findByUsername(ctx.params.username, {
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
    return (await userService.findByUsername(ctx.params.username, {
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
    return await userService.findPage(ctx.page, ctx.size, undefined, {
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
    return await userService.createOne({
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
    return await userService.deleteByUsername(ctx.params.username);
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
    return await userService.updateByUsername(ctx.params.username, {
      username: ctx.request.body.username,
      email: ctx.request.body.email,
      role: ctx.request.body.role
    }, {
      username: true,
      email: true,
      role: true
    });
  }

  @AuthorizeMe
  @Validate({ params: Users.validUsernameParam, body: Users.validUsername })
  @NotFound()
  async updateUsername(ctx: Context) {
    return await userService.updateByUsername(ctx.params.username, {
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
    return await userService.updateByUsername(ctx.params.username, {
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
    return await userService.updateByUsername(ctx.params.username, {
      role: ctx.request.body
    }, {
      username: true,
      email: true,
      role: true
    });
  }
}

export default new Users();

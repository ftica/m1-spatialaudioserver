import Router from '@koa/router';
import { Context, DefaultState } from 'koa';
import Joi from 'joi';
import userService, { UserService } from '../services/user-service';
import { AuthorizeAdmin, AuthorizeLogged, AuthorizeMe, NotFound, Ok, Paginate, Validate } from '../util/decorators';
import { Valid } from '../util/valid';

class Users {
  constructor(
    protected readonly userService: UserService
  ) { }

  static readonly validUsername = Joi.string().min(4).max(20).required();
  static readonly validUsernameParam = Joi.object({ username: this.validUsername });

  @AuthorizeLogged
  @Validate({ params: Users.validUsernameParam })
  @NotFound()
  async findByUsername(ctx: Context) {
    const meOrAdmin = ctx.admin || ctx.params.username === ctx.token.username;
    return await this.userService.findByUsername(ctx, ctx.params.username, {
      username: true,
      role: ctx.admin,
      playlists: {
        select: {
          id: true,
          name: true
        }
      },
      favorites: meOrAdmin && {
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
  @Ok
  async getAllPage(ctx: Context): Promise<any[]> {
    return await this.userService.findPage(ctx, ctx.page, ctx.size, undefined, {
      id: true,
      username: true,
      role: true
    });
  }

  @AuthorizeMe
  @Validate({ params: Users.validUsernameParam })
  @NotFound()
  async deleteByUsername(ctx: Context): Promise<any> {
    return await this.userService.deleteByUsername(ctx, ctx.params.username);
  }

  @AuthorizeMe
  @Validate({ params: Users.validUsernameParam, body: Users.validUsername })
  @NotFound()
  async updateUsername(ctx: Context) {
    return await this.userService.updateByUsername(ctx, ctx.params.username, { username: ctx.request.body });
  }

  @AuthorizeAdmin
  @Validate({ params: Users.validUsernameParam, body: Valid.role.required() })
  @NotFound()
  async updateRole(ctx: Context) {
    return await this.userService.updateByUsername(ctx, ctx.params.username, { role: ctx.request.body });
  }
}

const users = new Users(userService);

export default new Router<DefaultState, Context>()
  .get('/', users.getAllPage.bind(users))
  .get('/:username', users.findByUsername.bind(users))
  .get('/:username/tracks', users.findPlaylistsByUsername.bind(users))
  .get('/:username/playlists', users.findPlaylistsByUsername.bind(users))
  .get('/:username/favorites', users.findFavoritesByUsername.bind(users))
  .patch('/:username/username', users.updateUsername.bind(users))
  .patch('/:username/role', users.updateRole.bind(users));

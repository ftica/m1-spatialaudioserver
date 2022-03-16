import Router from '@koa/router';
import { Context, DefaultState } from 'koa';
import Joi from 'joi';
import { Role } from '@prisma/client';
import userService, { UserService } from '../services/user-service';
import { AuthorizeAdmin, AuthorizeLogged, AuthorizeMine, NotFound, Ok, Validate } from '../util/decorators';
import { Valid } from '../util/valid';
import playlistService, { PlaylistService } from '../services/playlist-service';
import trackService, { TrackService } from '../services/track-service';

class Users {
  constructor(
    protected readonly userService: UserService,
    protected readonly trackService: TrackService,
    protected readonly playlistService: PlaylistService
  ) { }

  static readonly validUsername = Joi.string().min(4).max(20).required();
  static readonly validRole = Joi.string().valid(Role.USER, Role.ADMIN).required();
  static readonly validUsernameParam = Joi.object({ username: this.validUsername });

  @AuthorizeLogged
  @Validate(Users.validUsernameParam)
  @NotFound()
  async findByUsername(ctx: Context) {
    return await this.userService.findByUsername(ctx, ctx.params.username, {
      username: true,
      role: ctx.admin
    });
  }

  @AuthorizeLogged
  @Validate(Users.validUsernameParam, null, Valid.pageQuery)
  @NotFound()
  async findPlaylistsByUsername(ctx: Context) {
    const page = parseInt(ctx.query.page as string);
    const size = parseInt(ctx.query.size as string);
    return (await this.userService.findByUsername(ctx, ctx.params.username, {
      playlists: {
        skip: page * size,
        take: size,
        select: {
          id: true,
          name: true
        }
      }
    })).playlists;
  }

  @AuthorizeMine
  @Validate(Users.validUsernameParam, null, Valid.pageQuery)
  @NotFound()
  async findFavoritesByUsername(ctx: Context) {
    const page = parseInt(ctx.query.page as string);
    const size = parseInt(ctx.query.size as string);
    return (await this.userService.findByUsername(ctx, ctx.params.username, {
      favorites: {
        skip: page * size,
        take: size,
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
  @Validate(null, null, Valid.pageQuery)
  @Ok
  async getAllPage(ctx: Context): Promise<any[]> {
    return await this.userService.findPage(ctx, parseInt(ctx.query.page as string), parseInt(ctx.query.size as string), undefined, {
      id: true,
      username: true,
      role: true
    });
  }

  @AuthorizeMine
  @Validate(Users.validUsernameParam)
  @NotFound()
  async deleteByUsername(ctx: Context): Promise<any> {
    return await this.userService.deleteByUsername(ctx, ctx.params.username);
  }

  @AuthorizeMine
  @Validate(Users.validUsernameParam, Users.validUsername)
  @NotFound()
  async updateUsername(ctx: Context) {
    return await this.userService.updateByUsername(ctx, ctx.params.username, { username: ctx.request.body });
  }

  @AuthorizeAdmin
  @Validate(Users.validUsernameParam, Users.validRole)
  @NotFound()
  async updateRole(ctx: Context) {
    return await this.userService.updateByUsername(ctx, ctx.params.username, { role: ctx.request.body });
  }
}

const users = new Users(userService, trackService, playlistService);

export default new Router<DefaultState, Context>()
  .get('/', users.getAllPage.bind(users))
  .get('/:username', users.findByUsername.bind(users))
  .get('/:username/tracks', users.findPlaylistsByUsername.bind(users))
  .get('/:username/playlists', users.findPlaylistsByUsername.bind(users))
  .get('/:username/favorites', users.findFavoritesByUsername.bind(users))
  .patch('/:username/username', users.updateUsername.bind(users))
  .patch('/:username/role', users.updateRole.bind(users));

// .get('/count', users.countAll.bind(users))
// .get('/profile', users.profile.bind(users))
// .del('/:username', users.deleteByUsername.bind(users))
// .patch('/:username/username', users.updateUsername.bind(users))
// .patch('/:username/role', users.updateRole.bind(users));

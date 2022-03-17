import Router from '@koa/router';
import { Context, DefaultState } from 'koa';
import Joi from 'joi';
import { Valid } from '../util/valid';
import { AuthorizeLogged, NotFound, Ok, Paginate, Validate } from '../util/decorators';
import playlistService, { PlaylistService } from '../services/playlist-service';

class Playlists {
  constructor(
    protected readonly playlistService: PlaylistService
  ) { }

  static readonly validName = Joi.string().min(3).max(100).required();
  static readonly validCreate = Joi.object({
    name: this.validName,
    public: Valid.bool
  });

  @AuthorizeLogged
  @Paginate()
  @Ok
  async getAllPage(ctx: Context): Promise<any> {
    return await this.playlistService.findPage(ctx, parseInt(ctx.query.page as string), parseInt(ctx.query.size as string),
      ctx.admin ? undefined : { public: true },
      {
        id: true,
        name: true,
        public: ctx.admin,
        owner: {
          username: true
        }
      }
    );
  }

  // @AuthorizeRole(Role.ADMIN, Role.USER)
  // @Validate(null, Playlists.validCreate)
  // @Ok
  // override async create(ctx: Context) {
  //   return await this.service.create(ctx, {
  //     id: undefined,
  //     name: ctx.request.body.name,
  //     public: ctx.request.body.public,
  //     ownerId: ctx.token.userId
  //   });
  // }

  // @AuthorizeRole(Role.ADMIN, Role.USER)
  // @Validate(Valid.idObject, Playlists.validName)
  // @NotFound()
  // async updateName(ctx: Context) {
  //   return await this.service.update(ctx, ctx.params.id, { name: ctx.request.body });
  // }

  // @AuthorizeRole(Role.ADMIN, Role.USER)
  // @Validate(Valid.idObject, Valid.bool)
  // @NotFound()
  // async updatePublic(ctx: Context) {
  //   return await this.service.update(ctx, ctx.params.id, { public: ctx.request.body === 'true' });
  // }

  // @AuthorizeRole(Role.ADMIN, Role.USER)
  // @Validate(Valid.idObject, Valid.idArray)
  // @NotFound()
  // async updateTracks(ctx: Context) {
  //   return await this.service.update(ctx, ctx.params.id, { tracks: ctx.request.body.map(track => ({ id: track })) });
  // }

  @AuthorizeLogged
  @Validate({ params: Valid.idParam, body: Valid.bool })
  @NotFound()
  async updateFavorite(ctx: Context) {
    return await this.playlistService.updateOne(ctx, ctx.params.id, { favorite: ctx.request.body === 'true' });
  }

  // @AuthorizeRole(Role.ADMIN, Role.USER)
  // @Validate(Valid.idObject, Valid.idArray)
  // @NotFound()
  // async updateAllowedUsers(ctx: Context) {
  //   return await this.service.update(ctx, ctx.params.id, { users: ctx.request.body.map(user => ({ id: user })) });
  // }
}

const playlists = new Playlists(playlistService);

export default new Router<DefaultState, Context>()
  .get('/', playlists.getAllPage.bind(playlists));

import Router from '@koa/router';
import { Context, DefaultState } from 'koa';
import Joi from 'joi';
import { Valid } from '../util/valid';
import { AuthorizeAdmin, AuthorizeLogged, NotFound, Ok, Paginate, Validate } from '../util/decorators';
import playlistService, { PlaylistService } from '../services/playlist-service';

export class Playlists {
  constructor(
    protected readonly playlistService: PlaylistService
  ) { }

  static readonly validName = Joi.string().min(3).max(100).required();
  static readonly validCreate = Joi.object({
    name: this.validName,
    public: Valid.bool
  });

  @AuthorizeAdmin
  @Paginate()
  @Ok()
  async getAllPage(ctx: Context): Promise<any> {
    return await this.playlistService.findPage(ctx,
      ctx.admin ? undefined : { public: true },
      {
        id: true,
        name: true,
        public: ctx.admin,
        owner: {
          select: {
            username: true
          }
        }
      }
    );
  }

  @AuthorizeAdmin
  @Validate({
    body: Joi.object({
      name: Playlists.validName,
      public: Valid.bool.default(false)
    })
  })
  @Ok(201)
  async create(ctx: Context): Promise<any> {
    return await this.playlistService.createOne(ctx, {
      id: undefined,
      ownerId: ctx.token.userId,
      name: ctx.request.body.name,
      public: ctx.request.body.public
    }, {
      id: true,
      name: true,
      public: true,
      owner: {
        select: {
          username: true
        }
      }
    });
  }

  @AuthorizeAdmin
  @Validate({
    params: Valid.idParam,
    body: Joi.object({
      name: Playlists.validName.optional(),
      public: Valid.bool,
      owner: Valid.id
    })
  })
  @NotFound()
  async update(ctx: Context): Promise<any> {
    return await this.playlistService.updateById(ctx, ctx.params.id, {
      name: ctx.request.body.name,
      public: ctx.request.body.public,
      owner: ctx.request.body.owner
        ? { where: { username: ctx.request.body.owner } }
        : undefined
    }, {
      id: true,
      name: true,
      public: true,
      owner: {
        select: {
          username: true
        }
      }
    });
  }

  @AuthorizeAdmin
  @Validate({ params: Valid.idParam })
  @NotFound()
  async delete(ctx: Context): Promise<any> {
    return await this.playlistService.deleteById(ctx, ctx.params.id, {
      id: true,
      name: true,
      public: true,
      owner: {
        select: {
          username: true
        }
      }
    });
  }

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
  .get('/', playlists.getAllPage.bind(playlists))
  .post('/', playlists.create.bind(playlists))
  .put('/:id', playlists.update.bind(playlists))
  .del('/:id', playlists.delete.bind(playlists));

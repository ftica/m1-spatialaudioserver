import Router from '@koa/router';
import { Context, DefaultState } from 'koa';
import { Playlist, Role } from '@prisma/client';
import ModelEndpoint from './model-endpoint';
import playlistService, { PlaylistService } from '../services/playlist-service';
import { Valid } from '../valid';
import Joi from 'joi';
import { AuthorizeRole, NotFound, Validate } from '../decorators';

class Playlists extends ModelEndpoint<Playlist, PlaylistService> {
  static readonly validName = Joi.string().min(3).max(100).required();

  static readonly validCreate = Joi.object({
    name: this.validName,
    public: Valid.bool,
    ownerId: Valid.id
  });

  @AuthorizeRole(Role.USER)
  @Validate(null, Playlists.validCreate)
  override async create(ctx: Context) {
    return super.create(ctx);
  }

  @AuthorizeRole(Role.USER)
  @Validate(Valid.idObject, Playlists.validName)
  @NotFound
  async updateName(ctx: Context) {
    return await this.service.update(ctx.prisma, ctx.params.id, { name: ctx.params.body });
  }

  @AuthorizeRole(Role.USER)
  @Validate(Valid.idObject, Valid.bool)
  @NotFound
  async updatePublic(ctx: Context) {
    return await this.service.update(ctx.prisma, ctx.params.id, { public: ctx.params.body === 'true' });
  }

  @AuthorizeRole(Role.USER)
  @Validate(Valid.idObject, Valid.idArray)
  @NotFound
  async updateTracks(ctx: Context) {
    return await this.service.update(ctx.prisma, ctx.params.id, { tracks: ctx.request.body.map(track => ({ id: track })) }, { tracks: true });
  }

  @AuthorizeRole(Role.USER)
  @Validate(Valid.idObject, Valid.bool)
  @NotFound
  async updateFavorite(ctx: Context) {
    return await this.service.update(ctx.prisma, ctx.params.id, { favorite: ctx.request.body === 'true' }, { favorites: true });
  }

  @AuthorizeRole(Role.USER)
  @Validate(Valid.idObject, Valid.idArray)
  @NotFound
  async updateAllowedUsers(ctx: Context) {
    return await this.service.update(ctx.prisma, ctx.params.id, { users: ctx.request.body.map(user => ({ id: user })) }, { users: true });
  }
}

const playlists = new Playlists(playlistService);

export default new Router<DefaultState, Context>()
  .get('/', playlists.getAll.bind(playlists))
  .get('/count', playlists.count.bind(playlists))
  .get('/:id', playlists.getById.bind(playlists))
  .post('/', playlists.create.bind(playlists))
  // .put('/:id', validate(Playlists.validId, Playlists.validUpdate), playlists.update.bind(playlists))
  .del('/:id', playlists.del.bind(playlists))
  .patch('/:id/name', playlists.updateName.bind(playlists))
  .patch('/:id/public', playlists.updateName.bind(playlists));

import Router from '@koa/router';
import { Context, DefaultState } from 'koa';
import { Playlist } from '@prisma/client';
import ModelEndpoint from './model-endpoint';
import playlistService, { PlaylistService } from '../services/playlist-service';
import validate, { Valid } from '../validator';
import Joi from 'joi';

class Playlists extends ModelEndpoint<Playlist, PlaylistService> {
  static readonly validName = Joi.string().min(3).max(100).required();

  static readonly validCreate = Joi.object({
    name: this.validName,
    public: Valid.bool,
    ownerId: Valid.id
  });

  async updateName(ctx: Context) {
    const playlist = await this.service.update(ctx.prisma, ctx.params.id, { name: ctx.params.body });
    if (playlist === null) ctx.status = 404;
    else ctx.body = playlist;
  }

  async updatePublic(ctx: Context) {
    const playlist = await this.service.update(ctx.prisma, ctx.params.id, { public: ctx.params.body === 'true' });
    if (playlist === null) ctx.status = 404;
    else ctx.body = playlist;
  }

  async setTracks(ctx: Context) {
    const playlist: Playlist = await this.service.update(ctx.prisma, ctx.params.id, { tracks: ctx.request.body.map(track => ({ id: track })) }, { tracks: true });
    if (playlist === null) ctx.status = 404;
    else ctx.body = playlist;
  }

  async setFavorite(ctx: Context) {
    const playlist: Playlist = await this.service.update(ctx.prisma, ctx.params.id, { favorite: ctx.request.body === 'true' }, { favorites: true });
    if (playlist === null) ctx.status = 404;
    else ctx.body = playlist;
  }

  async setAllowedUsers(ctx: Context) {
    const playlist: Playlist = await this.service.update(ctx.prisma, ctx.params.id, { users: ctx.request.body.map(user => ({ id: user })) }, { users: true });
    if (playlist === null) ctx.status = 404;
    else ctx.body = playlist;
  }
}

const playlists = new Playlists(playlistService);

export default new Router<DefaultState, Context>()
  .get('/', playlists.getAll.bind(playlists))
  .get('/count', playlists.count.bind(playlists))
  .get('/:id', validate(Valid.idObject), playlists.getById.bind(playlists))
  .post('/', validate(null, Playlists.validCreate), playlists.create.bind(playlists))
  // .put('/:id', validate(Playlists.validId, Playlists.validUpdate), playlists.update.bind(playlists))
  .del('/:id', validate(Valid.idObject), playlists.del.bind(playlists))
  .patch('/:id/name', validate(Valid.idObject, Playlists.validName), playlists.updateName.bind(playlists))
  .patch('/:id/public', validate(Valid.idObject, Valid.bool), playlists.updateName.bind(playlists));

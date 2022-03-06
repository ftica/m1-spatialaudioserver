import Router from '@koa/router';
import { Context, DefaultState } from 'koa';
import { Track } from '@prisma/client';
import ModelEndpoint from './model-endpoint';
import trackService, { TrackService } from '../services/track-service';
import validate, { Valid } from '../validator';
import Joi from 'joi';

export class Tracks extends ModelEndpoint<Track, TrackService> {
  static readonly validName = Joi.string().min(3).max(100).required();

  static readonly validCreate = Joi.object({
    name: this.validName,
    position: Valid.uint,
    playlistId: Valid.id
  });

  async updateName(ctx: Context) {
    const track = await this.service.update(ctx.prisma, ctx.params.id, { name: ctx.request.body });
    if (track === null) ctx.status = 404;
    else ctx.body = track;
  }

  async updatePosition(ctx: Context) {
    const track = await this.service.update(ctx.prisma, ctx.params.id, { position: parseInt(ctx.request.body) });
    if (track === null) ctx.status = 404;
    else ctx.body = track;
  }

  async updatePlaylist(ctx: Context) {
    const track = await this.service.update(ctx.prisma, ctx.params.id, { playlistId: ctx.request.body });
    if (track === null) ctx.status = 404;
    else ctx.body = track;
  }
}

const tracks = new Tracks(trackService);

export default new Router<DefaultState, Context>()
  .get('/', tracks.getAll.bind(tracks))
  .get('/count', tracks.count.bind(tracks))
  .get('/:id', validate(Valid.idObject), tracks.getById.bind(tracks))
  .post('/', validate(null, Tracks.validCreate), tracks.create.bind(tracks))
  .del('/:id', validate(Valid.idObject), tracks.del.bind(tracks))
  .patch('/:id/name', validate(Valid.idObject, Tracks.validName), tracks.updateName.bind(tracks))
  .patch('/:id/position', validate(Valid.idObject, Valid.uint), tracks.updatePosition.bind(tracks))
  .patch('/:id/playlist', validate(Valid.idObject, Valid.id), tracks.updatePlaylist.bind(tracks));

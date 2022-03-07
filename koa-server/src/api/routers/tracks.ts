import Router from '@koa/router';
import { Context, DefaultState } from 'koa';
import { Role, Track } from '@prisma/client';
import ModelEndpoint from './model-endpoint';
import trackService, { TrackService } from '../services/track-service';
import { Valid } from '../validator';
import Joi from 'joi';
import { AuthorizeRole, NotFound, Validate } from '../decorators';

export class Tracks extends ModelEndpoint<Track, TrackService> {
  static readonly validName = Joi.string().min(3).max(100).required();

  static readonly validCreate = Joi.object({
    name: this.validName,
    position: Valid.uint,
    playlistId: Valid.id
  });

  @AuthorizeRole(Role.ADMIN)
  override async create(ctx: Context) {
    return super.create(ctx);
  }

  @AuthorizeRole(Role.USER)
  @Validate(Valid.idObject, Tracks.validName)
  @NotFound
  async updateName(ctx: Context) {
    return await this.service.update(ctx.prisma, ctx.params.id, { name: ctx.request.body });
  }

  @AuthorizeRole(Role.USER)
  @Validate(Valid.idObject, Valid.uint)
  @NotFound
  async updatePosition(ctx: Context) {
    return await this.service.update(ctx.prisma, ctx.params.id, { position: parseInt(ctx.request.body) });
  }

  @AuthorizeRole(Role.USER)
  @Validate(Valid.idObject, Valid.id)
  @NotFound
  async updatePlaylist(ctx: Context) {
    return await this.service.update(ctx.prisma, ctx.params.id, { playlistId: ctx.request.body });
  }
}

const tracks = new Tracks(trackService);

export default new Router<DefaultState, Context>()
  .get('/', tracks.getAll.bind(tracks))
  .get('/count', tracks.count.bind(tracks))
  .get('/:id', tracks.getById.bind(tracks))
  .post('/', tracks.create.bind(tracks))
  .del('/:id', tracks.del.bind(tracks))
  .patch('/:id/name', tracks.updateName.bind(tracks))
  .patch('/:id/position', tracks.updatePosition.bind(tracks))
  .patch('/:id/playlist', tracks.updatePlaylist.bind(tracks));

import Router from '@koa/router';
import { Context, DefaultState } from 'koa';
import trackService, { TrackService } from '../services/track-service';
import { Valid } from '../util/valid';
import Joi from 'joi';
import { AuthorizeAdmin, AuthorizeLogged, NotFound, Ok, Paginate, Validate } from '../util/decorators';

export class Tracks {
  constructor(
    protected readonly trackService: TrackService
  ) { }

  static readonly validName = Joi.string().min(3).max(100).required();
  static readonly validCreate = Joi.object({
    name: this.validName,
    position: Valid.uint.required(),
    playlistId: Valid.id.required()
  });

  @AuthorizeAdmin
  @Paginate()
  @Ok
  async getAllPage(ctx: Context): Promise<any[]> {
    return await this.trackService.findPage(ctx, ctx.page, ctx.size, undefined, {
      id: true,
      name: true,
      playlist: {
        select: {
          id: true,
          name: true,
          public: true,
          owner: {
            id: true,
            username: true
          }
        }
      }
    });
  }

  // @AuthorizeRole(Role.ADMIN, Role.USER)
  // @Validate(null, Tracks.validCreate)
  // override async createOne(ctx: Context) {
  //   return super.createOne(ctx);
  // }

  @AuthorizeLogged
  @Validate({ params: Valid.idParam.required(), body: Tracks.validName })
  @NotFound()
  async updateName(ctx: Context) {
    return await this.trackService.updateOne(ctx, {
      id: ctx.params.id,
      playlist: ctx.admin ? undefined : { ownerId: ctx.token.userId }
    }, {
      name: ctx.request.body
    });
  }

  // @AuthorizeRole(Role.ADMIN, Role.USER)
  // @Validate(Valid.idObject, Valid.uint)
  // @NotFound()
  // async updatePosition(ctx: Context) {
  //   return await this.service.updateById(ctx, ctx.params.id, { position: parseInt(ctx.request.body) });
  // }

  // @AuthorizeRole(Role.ADMIN, Role.USER)
  // @Validate(Valid.idObject, Valid.id)
  // @NotFound()
  // async updatePlaylist(ctx: Context) {
  //   return await this.service.updateById(ctx, ctx.params.id, { playlistId: ctx.request.body });
  // }
}

const tracks = new Tracks(trackService);

export default new Router<DefaultState, Context>()
  .get('/', tracks.getAllPage.bind(tracks))

  // .get('/count', tracks.count.bind(tracks))
  // .get('/:id', tracks.getById.bind(tracks))
  // .post('/', tracks.create.bind(tracks))
  // .del('/:id', tracks.del.bind(tracks))
  .patch('/:id/name', tracks.updateName.bind(tracks));
// .patch('/:id/position', tracks.updatePosition.bind(tracks))
// .patch('/:id/playlist', tracks.updatePlaylist.bind(tracks));

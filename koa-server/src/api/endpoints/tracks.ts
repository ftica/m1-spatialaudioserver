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

  @AuthorizeAdmin
  @Paginate()
  @Ok()
  async getAllPage(ctx: Context): Promise<any[]> {
    return await this.trackService.findPage(ctx, undefined, {
      id: true,
      name: true,
      playlist: {
        select: {
          id: true,
          name: true,
          public: true,
          owner: {
            select: {
              id: true,
              username: true
            }
          }
        }
      }
    });
  }

  @AuthorizeAdmin
  @Ok(201)
  async create(ctx: Context) {
    console.log('request.files: ', ctx.request.files);
    console.log('files: ', ctx.files);
    console.log('body: ', ctx.request.body);
    // return await Promise.all(ctx.request.files.map(async (file) => {
    //   return await this.trackService.createOne(ctx, file, {
    //     id: true,
    //     name: true
    //   });
    // }));
    // return await this.trackService.createOne(ctx, ctx.request.body, {
    //   id: true,
    //   name: true
    // });
    return ctx;
  }

  @AuthorizeAdmin
  @Validate({ params: Valid.idParam })
  @NotFound()
  async delete(ctx: Context) {
    return await this.trackService.deleteById(ctx, ctx.params.id, {
      id: true,
      name: true
    });
  }

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
  // .get('/:id', tracks.getById.bind(tracks))
  .post('/', tracks.create.bind(tracks))
  .del('/:id', tracks.delete.bind(tracks))
  .patch('/:id/name', tracks.updateName.bind(tracks));
// .patch('/:id/position', tracks.updatePosition.bind(tracks))
// .patch('/:id/playlist', tracks.updatePlaylist.bind(tracks));

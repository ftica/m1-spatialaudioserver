// import Router from '@koa/router';
import { Context } from 'koa';
import trackService from '../services/track-service';
import Joi from 'joi';
import { AuthorizeAdmin, AuthorizeLogged } from '../util/decorators/authorization';
import { Paginate } from '../util/decorators/request';
import { NotFound, Ok } from '../util/decorators/response';
import { Valid, Validate } from '../util/decorators/validation';

export class Tracks {
  static readonly validName = Joi.string().min(3).max(100).required();

  @AuthorizeAdmin
  @Paginate()
  @Ok()
  async getAll(ctx: Context): Promise<any[]> {
    return await trackService.findMany(undefined, {
      id: true,
      name: true,
      position: true,
      playlist: {
        select: {
          id: true,
          name: true,
          isPublic: true,
          owner: {
            select: {
              id: true,
              username: true
            }
          }
        }
      }
    }, {
      position: 'asc'
    });
  }

  @AuthorizeLogged
  // @Validator(400, 'No files provided', ctx => ctx.files !== null)
  @Validate({
    body: Joi.object({
      name: Tracks.validName,
      playlist: Valid.id,
      position: Valid.uint
    })
  })
  @Ok(201)
  async create(ctx: Context) {
    // @ts-ignore
    return await trackService.createOne({
      name: ctx.request.body.name,
      playlistId: ctx.request.body.playlist,
      position: ctx.request.body.position
    }, {
      id: true,
      name: true,
      position: true,
      playlist: {
        select: {
          id: true,
          name: true
        }
      }
    });
  }

  @AuthorizeAdmin
  @Validate({ params: Valid.idParam })
  @NotFound()
  async delete(ctx: Context) {
    return await trackService.deleteById(ctx.params.id, {
      id: true,
      name: true
    });
  }

  @AuthorizeLogged
  @Validate({ params: Valid.idParam.required(), body: Tracks.validName })
  @NotFound()
  async updateName(ctx: Context) {
    return await trackService.updateOne({
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

export default new Tracks();

// export default new Router<DefaultState, Context>()
//   .get('/', tracks.getAll.bind(tracks))
//   // .get('/:id', tracks.getById.bind(tracks))
//   .post('/', tracks.create.bind(tracks))
//   .del('/:id', tracks.delete.bind(tracks))
// .patch('/:id/name', tracks.updateName.bind(tracks));
// .patch('/:id/position', tracks.updatePosition.bind(tracks))
// .patch('/:id/playlist', tracks.updatePlaylist.bind(tracks));

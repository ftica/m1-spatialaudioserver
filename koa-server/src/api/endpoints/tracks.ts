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
  // @Validate({
  //   body: Joi.object({
  //     name: Tracks.validName,
  //     playlist: Valid.id,
  //     position: Valid.uint
  //   })
  // })
  // @Ok(201)
  async upload(ctx: Context) {
    return trackService.upload(ctx, {
      name: ctx.request.body.name,
      playlistId: ctx.request.body.playlist,
      position: ctx.request.body.position
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

import { Context } from 'koa';
import trackService from '../services/track-service';
import Joi from 'joi';
import { AuthorizeAdmin, AuthorizeLogged } from '../util/decorators/authorization';
import { Paginate } from '../util/decorators/request';
import { NotFound, Ok } from '../util/decorators/response';
import { Valid, Validate, Validator } from '../util/decorators/validation';
import { Uploader } from '../util/decorators/upload';
import { Stream } from '../util/decorators/stream';
import paths from '../util/paths';
// import { Serve } from '../util/decorators/serve';

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

  // @AuthorizeLogged
  @Validate({ params: Joi.object({ file: Joi.string().regex(/^(\w+)\.(\w+)$/) }) })
  // @Authorize() // TODO: authorize users by track access list
  @Stream(paths.streamsFolder)
  async stream() {}

  @AuthorizeAdmin
  @Uploader('/tracks', 'track', { files: 1 })
  @Validator(400, 'No file provided', ctx => ctx.file !== null)
  @Validator(415, null, ctx => ctx.file.mimetype === 'audio/wav')
  @Validator(400, 'No file name provided', ctx => ctx.file.originalname?.split('.')?.[0] !== null)
  @Ok(201)
  async upload(ctx: Context) {
    console.log(ctx.file);
    return await trackService.upload(ctx, {
      name: ctx.file.originalname.split('.')[0],
      filename: ctx.file.filename
    }, {
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

  // @AuthorizeRole(Role.ADMIN)
  // @Validate(Valid.idObject, Valid.id)
  // @NotFound()
  // async updatePlaylist(ctx: Context) {
  //   return await this.service.updateById(ctx, ctx.params.id, { playlistId: ctx.request.body });
  // }
}

export default new Tracks();

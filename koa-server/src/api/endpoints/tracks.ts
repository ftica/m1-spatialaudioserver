import { Context } from 'koa';
import trackService from '../services/track-service';
import Joi from 'joi';
import { Authorize, AuthorizeAdmin, AuthorizeLogged } from '../util/decorators/authorization';
import { Paginate } from '../util/decorators/request';
import { NotFound, Ok } from '../util/decorators/response';
import { Valid, ValidateBody, ValidateParams, Validator } from '../util/decorators/validation';
import { Uploader } from '../util/decorators/upload';
import { Stream } from '../util/decorators/stream';
import paths from '../util/paths';
import playlistService from '../services/playlist-service';

export class Tracks {
  static readonly validName = Joi.string().min(3).max(100).required();

  @AuthorizeAdmin
  @Paginate()
  @Ok()
  async getAll(): Promise<any[]> {
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
  @ValidateParams(Joi.object({ file: Joi.string().regex(/^\w+\.\w+$/) })) // name.extension
  @Authorize(async (ctx) => {
    const filename = ctx.params.file.split('.')[0] + '.wav';
    const track = await trackService.findUnique({ filename }, { playlist: { select: { id: true, isPublic: true, ownerId: true } } });
    if (!track) return ctx.throw(404);
    return ctx.admin ||
            track.playlist?.isPublic ||
            ctx.token.userId === track.playlist?.ownerId ||
            await playlistService.hasAccess(ctx.token.userId, track.playlist?.id);
  })
  @Stream(paths.streamsFolder)
  async stream() {}

  @AuthorizeAdmin
  @Uploader('/tracks', 'track', { files: 1 })
  @Validator(400, 'No file provided', async (ctx) => ctx.file !== null)
  @Validator(415, null, async (ctx) => ctx.file.mimetype === 'audio/wav')
  @Validator(400, 'No file name provided', async (ctx) => ctx.file.originalname?.split('.')?.[0] !== null)
  @Ok(201)
  async upload(ctx: Context) {
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
  @ValidateParams(Valid.idParam)
  @NotFound()
  async delete(ctx: Context) {
    return await trackService.deleteById(ctx.params.id, {
      id: true,
      name: true
    });
  }

  @AuthorizeLogged
  @ValidateParams(Valid.idParam.required())
  @ValidateBody(Tracks.validName)
  @NotFound()
  async updateName(ctx: Context) {
    return await trackService.updateOne({
      id: ctx.params.id,
      playlist: ctx.admin ? undefined : { ownerId: ctx.token.userId }
    }, {
      name: ctx.request.body
    });
  }
}

export default new Tracks();

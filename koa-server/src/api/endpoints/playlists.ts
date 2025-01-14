import { Context } from 'koa';
import Joi from 'joi';
import playlistService from '../services/playlist-service';
import { AuthorizeAdmin, AuthorizeLogged } from '../util/decorators/authorization';
import { Paginate } from '../util/decorators/request';
import { NotFound, Ok } from '../util/decorators/response';
import { Valid, ValidateBody, ValidateParams } from '../util/decorators/validation';

export class Playlists {
  static readonly validName = Joi.string().min(3).max(100).required();
  static readonly validCreate = Joi.object({
    name: this.validName,
    isPublic: Valid.bool
  });

  @AuthorizeLogged
  @Ok()
  async getSectioned(ctx: Context) {
    return [
      {
        section: 'mine',
        items: await playlistService.findMany({
          ownerId: ctx.token.userId
        }, {
          id: true,
          name: true,
          isPublic: true
        })
      }, {
        section: 'private',
        items: await playlistService.findMany({
          isPublic: false,
          users: { some: { userId: ctx.token.userId } }
        }, {
          id: true,
          name: true,
          owner: {
            select: {
              username: true
            }
          }
        })
      }, {
        section: 'public',
        items: await playlistService.findMany({
          isPublic: true,
          ownerId: { not: ctx.token.userId }
        }, {
          id: true,
          name: true,
          owner: {
            select: {
              username: true
            }
          }
        })
      }
    ];
  }

  @AuthorizeLogged
  @Paginate()
  @Ok()
  async getAllPage(ctx: Context): Promise<any> {
    return await playlistService.findPage(ctx.page, ctx.size,
      ctx.admin ? undefined : { isPublic: true },
      {
        id: true,
        name: true,
        isPublic: ctx.admin,
        owner: {
          select: {
            username: true
          }
        },
        tracks: {
          select: {
            id: true,
            name: true
          },
          orderBy: { position: 'asc' }
        }
      }
    );
  }

  @AuthorizeLogged
  @ValidateParams(Valid.idParam)
  @NotFound()
  async getById(ctx: Context): Promise<any> {
    return await playlistService.findFirst({
      id: ctx.params.id,
      OR: ctx.admin
        ? undefined
        : [
            { isPublic: true },
            { ownerId: ctx.token.userId },
            { users: { some: { userId: ctx.token.userId } } }
          ]
    }, {
      id: true,
      name: true,
      isPublic: ctx.admin,
      owner: {
        select: {
          username: true
        }
      },
      tracks: {
        select: {
          id: true,
          name: true
        },
        orderBy: { position: 'asc' }
      }
    });
  }

  @AuthorizeLogged
  @ValidateBody(Joi.object({
    name: Playlists.validName,
    isPublic: Valid.bool.default(false)
  }))
  @Ok(201)
  async create(ctx: Context): Promise<any> {
    return await playlistService.createOne({
      ownerId: ctx.token.userId,
      name: ctx.request.body.name,
      isPublic: ctx.request.body.isPublic
    }, {
      id: true,
      name: true,
      isPublic: true,
      owner: {
        select: {
          username: true
        }
      }
    });
  }

  @AuthorizeLogged
  @ValidateParams(Valid.idParam)
  @ValidateBody(Joi.object({
    name: Playlists.validName.optional(),
    isPublic: Valid.bool,
    owner: Valid.id,
    tracks: Valid.idArray
  }))
  @NotFound()
  async update(ctx: Context): Promise<any> {
    return await playlistService.updateById(ctx.params.id, {
      name: ctx.request.body.name,
      isPublic: ctx.request.body.isPublic,
      ownerId: ctx.request.body.owner,
      tracks: ctx.request.body.tracks
    }, {
      id: true,
      name: true,
      isPublic: true,
      owner: {
        select: {
          username: true
        }
      },
      tracks: {
        select: {
          id: true,
          name: true,
          position: true
        },
        orderBy: { position: 'asc' }
      }
    });
  }

  @AuthorizeAdmin
  @ValidateParams(Valid.idParam)
  @NotFound()
  async delete(ctx: Context): Promise<any> {
    return await playlistService.deleteById(ctx.params.id, {
      id: true,
      name: true,
      isPublic: true,
      owner: {
        select: {
          username: true
        }
      }
    });
  }

  @AuthorizeLogged
  @ValidateParams(Valid.idParam)
  @ValidateBody(Valid.bool)
  @NotFound()
  async updateFavorite(ctx: Context) {
    return await playlistService.updateOne(ctx.params.id, { favorite: ctx.request.body === 'true' });
  }
}

export default new Playlists();

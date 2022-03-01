import Router from '@koa/router';
import { Context, DefaultState } from 'koa';
import { Playlist, Role } from '@prisma/client';
import playlistService from '../services/playlist-service';
import { Security } from '../decorators';
import Authenticated = Security.Authenticated;
import Authorized = Security.Authorized;

class PlaylistResource {
    @Authenticated
    private async all(ctx: Context, next?: () => any): Promise<any> {

    }

    @Authorized(Role.ADMIN, Role.USER)
    private async one(ctx: Context): Promise<any> {
        
    }
}

const getAll = async ctx => {
    const playlists: Playlist[] = await playlistService.getAll(ctx.prisma.playlist);
    ctx.body = playlists;
}

const getById = async ctx => {
    const id: string = ctx.params.id;
    const playlist: Playlist = await playlistService.getById(ctx.prisma.playlist, id);
    ctx.body = playlist;
}

const update = async ctx => {
    const id: string = ctx.params.id;
    const data: Playlist = ctx.request.body;
    const playlist: Playlist = await playlistService.update(ctx.prisma.playlist, id, data);
    ctx.body = playlist;
}

const del = async ctx => {
    const id: string = ctx.params.id;
    const playlist: Playlist = await playlistService.delete(ctx.prisma.playlist, id);
    ctx.body = playlist;
}

const setTracks = async ctx => {
    const id: string = ctx.params.id;
    const tracks: string[] = ctx.request.body;
    const playlist: Playlist = await playlistService.update(ctx.prisma.playlist, id, { tracks: tracks.map(t => { id: t }) });
    ctx.body = playlist;
}

const setFavorite = async ctx => {
    const id: string = ctx.params.id;
    const favorite: boolean = ctx.request.body.favorite;
    const playlist: Playlist = await playlistService.update(ctx.prisma.playlist, id, { favorite });
    ctx.body = playlist;
}

// const getAllowedUsers = async ctx => {
//     const id: string = ctx.params.id;
//     const playlist: User[] = await playlistService.getById(ctx.prisma, id);
//     ctx.body = playlist;
// }

// const setAllowedUsers = async ctx => {
//     const id: string = ctx.params.id;
//     const playlist: User[] = await playlistService.update(ctx.prisma. id).allowed_users;
//     ctx.body = playlist;
// }

export default new Router<DefaultState, Context>()
  .get('/', getAll)
  .get('/:id', getById)
  .post('/')
  .put('/:id', update)
  .del('/:id', del)
  .patch('/:id/tracks', setTracks)
  .patch('/:id/favorite', setFavorite)
//   .get('/:id/allowed-users', getAllowedUsers)
//   .patch('/:id/allowed-users', setAllowedUsers)





// import _ from 'lodash';
// import Router from '@koa/router';
// import { PlaylistModel } from '../models';
// import authenticated from '../../koa/middleware/authentication';
// import { hasAnyRole } from '../../koa/middleware/authorization';
// import { ROLE_ADMIN, ROLE_USER } from '../../auth/auth-utils';

// // /**
// //  * List of methods that will be called only if `authenticator` method success
// //  * @type {Array}
// //  */
// // protectored: ['create', 'update', 'del'],
// /**
//  * @param  {Object}  ctx  the default koa context whose encapsulates
//  *                          node's request and response objects into a single object
//  */
// async function list(ctx) {
//   const { user } = ctx.session;

//   ctx.body = await new PlaylistModel().getItemsByUserRole(user);
// }

// /**
//  * Creating a new playlist by PlaylistModel and save it to DB
//  * @param  {Object}  ctx  the default koa context whose encapsulates
//  *                          node's request and response objects into a single object
//  */
// async function create(ctx) {
//   const { body } = ctx.request;

//   const { playlist } = new PlaylistModel(body);

//   await ctx.redis.multi()
//     .hset(`playlist:${playlist.id}`, playlist)
//     .rpush('playlist:all', `playlist:${playlist.id}`)
//     .exec();

//   ctx.status = 201;
//   ctx.body = playlist;
// }

// /**
//  * Updating a playlist by playlist id and save it to DB
//  * @param  {Object}  ctx  the default koa context whose encapsulates
//  *                          node's request and response objects into a single object
//  */
// async function update(ctx) {
//   const { id } = ctx.params;
//   const { body } = ctx.request;

//   if (_.isEmpty(body)) ctx.throw(400, 'Error! An empty payload was passed to the request');

//   const item = await ctx.redis.hgetall(`playlist:${id}`);
//   if (_.isNull(item)) ctx.throw(404);

//   const payload = new PlaylistModel(item).difference(body);
//   if (_.isEmpty(payload)) ctx.throw(400, 'Error! Nothing to change');

//   await PlaylistModel
//     .initStoreTransaction(item, payload)
//     .hset(`playlist:${id}`, payload)
//     .exec();

//   ctx.body = { ...item, ...payload };
// }

// /**
//  * Removing a playlist from DB by playlist id and return empty body with 204;
//  * returns 404 if not found
//  * @param  {Object}  ctx  the default koa context whose encapsulates
//  *                          node's request and response objects into a single object
//  */
// async function remove(ctx) {
//   const { id } = ctx.params;
//   const key = `playlist:${id}`;
//   const playlist = await ctx.redis.hgetall(key);
//   if (_.isEmpty(playlist)) ctx.throw(404);

//   await Promise.all([
//     ctx.redis.del(key),
//     ctx.redis.lrem('playlist:all', 0, key)
//   ]);

//   ctx.status = 204;
// }

// export default new Router()
//   .get('/', authenticated(), hasAnyRole(ROLE_USER, ROLE_ADMIN), list)
//   .post('/', authenticated(), hasAnyRole(ROLE_ADMIN), create)
//   .put('/:id', authenticated(), hasAnyRole(ROLE_ADMIN), update)
//   .del('/:id', authenticated(), hasAnyRole(ROLE_ADMIN), remove);

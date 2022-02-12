import { writeFile } from 'fs/promises';

import _ from 'lodash';
// import { v4 as uuid } from 'uuid';
import multer from '@koa/multer';

import Router from '@koa/router';
import { TrackModel } from './models';
import authenticated from '../configs/middleware/authentication';
import { hasAnyRole } from '../configs/middleware/authorization';
import { ROLE_ADMIN } from '../configs/auth/auth-utils';

const uploader = multer()
  .any();

// export default {
//   /**
//    * All methods from resource will be called only if `authenticator` method success
//    * @type {Boolean}
//    */
//   protectored: true,
/**
 * Writing multiple files to fs, generating and saving files id to the DB
 * @param  {Object}  ctx  the default koa context whose encapsulates
 *                          node's request and response objects into a single object
 */
async function save(ctx, next) {
  await uploader(ctx, next);

  const tracks = [];
  await Promise.all(_.map(
    ctx.request.files, async (file) => {
      const { track } = new TrackModel(file);
      tracks.push(track);

      return Promise.all([
        writeFile(new URL(`../public/${track.originalname}`, import.meta.url), file.buffer),
        ctx.redis.multi()
          .hset(`track:${track.id}`, track)
          .rpush('tracks:all', `track:${track.id}`)
          .exec(),
      ]);
    },
  ));
  ctx.status = 201;
  ctx.body = tracks;
}

// };

export default new Router()
  .post('/', authenticated(), hasAnyRole(ROLE_ADMIN), save);
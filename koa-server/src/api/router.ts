import Router from '@koa/router';

import auth from './routers/auth';
import users from './routers/users';
import tracks from './routers/tracks';
import playlists from './routers/playlists';
// import upload from './routers/upload';
import { Context, DefaultState } from 'koa';

export default new Router<DefaultState, Context>({ prefix: '/api/v1' })
  .use('/auth', auth.routes(), auth.allowedMethods())
  .use('/users', users.routes(), users.allowedMethods())
  .use('/tracks', tracks.routes(), tracks.allowedMethods())
  .use('/playlists', playlists.routes(), playlists.allowedMethods());
// .use('/upload', upload.routes(), upload.allowedMethods())

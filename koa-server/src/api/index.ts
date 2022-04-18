import Router from '@koa/router';
import { Context, DefaultState } from 'koa';

import auth from './endpoints/auth';
import users from './endpoints/users';
import tracks from './endpoints/tracks';
import playlists from './endpoints/playlists';
// import upload from './routers/upload';

export default new Router<DefaultState, Context>({ prefix: '/api' })
  .use('/auth', auth.routes(), auth.allowedMethods())
  .use('/users', users.routes(), users.allowedMethods())
  .use('/tracks', tracks.routes(), tracks.allowedMethods())
  .use('/playlists', playlists.routes(), playlists.allowedMethods());
// .use('/upload', upload.routes(), upload.allowedMethods())

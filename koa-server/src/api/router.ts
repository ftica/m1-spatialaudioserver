import Router from '@koa/router';

import auth from './routers/auth';
import playlists from './routers/playlists';
// import profile from './routers/profile';
import tracks from './routers/tracks';
// import upload from './routers/upload';
import users from './routers/users';
import { DefaultState } from 'koa';
import { CustomContext } from '../koa/types';

export default new Router<DefaultState, CustomContext>({ prefix: '/api/v1' })
  .use('/auth', auth.routes(), auth.allowedMethods())
  .use('/playlists', playlists.routes(), playlists.allowedMethods())
  // .use('/profile', profile.routes(), profile.allowedMethods())
  .use('/tracks', tracks.routes(), tracks.allowedMethods())
  // .use('/upload', upload.routes(), upload.allowedMethods())
  .use('/users', users.routes(), users.allowedMethods());

// .post('/auth', auth.login)
// .del('/auth/logout', auth.validate, auth.logout);

// User profile route
// router
//   .get('/profile', profile.get);
// .put('/profile', auth.validate, profile.update);

// Playlist route
// router
//   .get('/playlists', playlists.list)
//   .post('/playlists', auth.validate, playlists.create)
//   .put('/playlists/:id', auth.validate, playlists.update)
//   .del('/playlists/:id', auth.validate, playlists.remove);

// Tracks route
// router
//   .get('/tracks/:id', tracks.get)
//   .get('/tracks', tracks.list)
//   .put('/tracks/:id', auth.validate, tracks.update)
//   .del('/tracks/:id', auth.validate, tracks.remove);

// Uploader
// router.post('/upload', auth.validate, upload.save);

// User route
// router
//   .get('/users', auth.validate, users.list)
//   .post('/users', auth.validate, users.create)
//   .del('/users/:id', auth.validate, users.remove);

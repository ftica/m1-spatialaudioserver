import Router from '@koa/router';
import { Context, DefaultState } from 'koa';

import auth from './endpoints/auth';
import users from './endpoints/users';
import tracks from './endpoints/tracks';
import playlists from './endpoints/playlists';
// import upload from './routers/upload';

const route = (prefix = undefined) => new Router<DefaultState, Context>({ prefix });

export default route('/api')

  .use('/auth', route()
    .post('/register', auth.register.bind(auth))
    .post('/login', auth.login.bind(auth))
    .post('/login/oauth', auth.loginOAuth.bind(auth))
    .routes())

  .use('/users', route()
    .get('/', users.getAllPage.bind(users))
    .get('/me', users.profile.bind(users))
    .get('/:username', users.findByUsername.bind(users))
    .get('/:username/tracks', users.findPlaylistsByUsername.bind(users))
    .get('/:username/playlists', users.findPlaylistsByUsername.bind(users))
    .get('/:username/favorites', users.findFavoritesByUsername.bind(users))
    .post('/', users.create.bind(users))
    .del('/:username', users.deleteByUsername.bind(users))
    .put('/:username', users.update.bind(users))
    .patch('/:username/username', users.updateUsername.bind(users))
    .patch('/:username/email', users.updateEmail.bind(users))
    .patch('/:username/role', users.updateRole.bind(users))
    .routes())

  .use('/tracks', route()
    .get('/', tracks.getAll.bind(tracks))
    // .get('/:id', tracks.getById.bind(tracks))
    .post('/', tracks.create.bind(tracks))
    .del('/:id', tracks.delete.bind(tracks))
    .patch('/:id/name', tracks.updateName.bind(tracks))
    .routes())

  .use('/playlists', route()
    .get('/', playlists.getAllPage.bind(playlists))
    .get('/sectioned', playlists.getSectioned.bind(playlists))
    .get('/:id', playlists.getById.bind(playlists))
    .post('/', playlists.create.bind(playlists))
    .put('/:id', playlists.update.bind(playlists))
    .del('/:id', playlists.delete.bind(playlists))
    .routes());

// .use('/upload', upload.routes(), upload.allowedMethods())

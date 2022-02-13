import Koa from 'koa';

import middleware from './middleware';
import router from '../api/router';

const server: Koa = new Koa();

server.keys = ['test'];
server.proxy = true;

server.use(middleware(server));

server.use(router.routes());
server.use(router.allowedMethods());

export default server;
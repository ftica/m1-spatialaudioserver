import Router from '@koa/router';
import authenticated from '../../koa/middleware/authentication';
import { hasAnyRole } from '../../koa/middleware/authorization';
import { ROLE_ADMIN, ROLE_USER } from '../../auth/auth-utils';
import { CustomContext } from '../../koa/types';

/**
 * Checking and returning current user session: if exist return 200 else empty body and 204.
 * Removing session object if a session was corrupted
 * @param  {Object}  ctx  the default koa context whose encapsulates
 *                          node's request and response objects into a single object
 */
const get = async (ctx: CustomContext) => {
  const { user } = ctx.session;
  const userId = user?.id;

  ctx.status = userId ? 200 : 204;
  ctx.body = { user };

  if (userId) {
    const profile = await ctx.redis.hget(`user:${userId}`, 'id');

    if (!profile) {
      ctx.session = null;
      ctx.throw(403, 'Session expired');
    }
  }
};

export default new Router()
  .get('/', authenticated(), hasAnyRole(ROLE_USER, ROLE_ADMIN), get);

export default () => async (ctx, next) => {
  if (!ctx.token) {
    ctx.throw(400, 'Failed to authenticate user');
  }

  return next();
};

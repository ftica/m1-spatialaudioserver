const authorize = (tokenTestFn) => async (ctx, next) => {
  if (!tokenTestFn(ctx.token)) {
    ctx.throw(403, 'Unauthorized!');
  }

  return next();
};

const hasAnyRole = (...roles) => authorize(
  (token) => token.roles.some((role) => roles.includes(role))
);

export {
  authorize,
  hasAnyRole
};

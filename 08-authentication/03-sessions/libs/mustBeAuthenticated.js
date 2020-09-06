module.exports = function mustBeAuthenticated(ctx, next) {
  if (!ctx.user) {
    const err = new Error();
    err.status = 401;
    err.message = 'Пользователь не залогинен';
    throw err;
  }

  return next();
};

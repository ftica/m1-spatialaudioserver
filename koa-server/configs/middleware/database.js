import { sequelize } from '../../database/config';

export default () => async (ctx, next) => {
  ctx.db = sequelize;
  return next();
};

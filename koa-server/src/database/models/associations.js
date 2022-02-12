import { DataTypes } from 'sequelize';
import AuthUser from './auth-user';
import AccessToken from './access-token';

AuthUser.hasOne(AccessToken, {
  sourceKey: 'id',
  keyType: DataTypes.UUID,
});
AccessToken.belongsTo(AuthUser, {
  targetKey: 'id',
  keyType: DataTypes.UUID,
  foreignKey: {
    name: 'fk_access_token_auth_user_id',
    allowNull: false,
    field: 'auth_user',
  },
  onDelete: 'CASCADE',
  onUpdate: 'CASCADE',
  foreignKeyConstraint: true,
});

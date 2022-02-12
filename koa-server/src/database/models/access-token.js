import { DataTypes, Model } from 'sequelize';
import { sequelize } from '../config';
import { defaultAttributes, defaultOptions } from './model-defaults';
import AuthUser from './auth-user';

export default class AccessToken extends Model {
}

const attributes = {
  id: { ...defaultAttributes.id },
  expires: {
    field: 'expires',
    type: DataTypes.DATE,
    allowNull: false,
  },
  authUser: {
    field: 'auth_user',
    type: DataTypes.UUID,
    allowNull: false,
    references: {
      model: AuthUser,
      key: 'id',
    },
    get() {

    },
  },
};

const options = {
  sequelize,
  modelName: 'AccessToken',
  tableName: 'access_token',
  indexes: [
    {
      name: 'uk_access_token_auth_user',
      unique: true,
      fields: [attributes.authUser.field],
    },
  ],
  ...defaultOptions,
};

AccessToken.init(attributes, options);

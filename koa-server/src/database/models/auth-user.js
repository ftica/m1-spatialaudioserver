import { DataTypes, Model } from 'sequelize';
import { sequelize } from '../config';
import * as util from '../../configs/auth/auth-utils';
import { defaultAttributes, defaultOptions } from './model-defaults';

export default class AuthUser extends Model {
}

const attributes = {
  id: { ...defaultAttributes.id },
  email: {
    field: 'email',
    type: DataTypes.STRING(255),
    allowNull: false,
    validate: {
      isEmail: true,
    },
  },
  password: {
    field: 'password',
    type: DataTypes.STRING(512),
    allowNull: false,
    validate: {
      len: [8, 512],
    },
    get() {
      const rawValue = this.getDataValue(this.password);
      return util.fromPasswordString(rawValue);
    },
    async set(value) {
      this.setDataValue(this.password, await util.getDigest(value));
    },
  },
  roles: {
    field: 'roles',
    type: DataTypes.ARRAY(DataTypes.STRING(20)),
    allowNull: false,
    validate: {
      len: [1, 2],
      validRoles(input) {
        input.forEach((role) => {
          if (!['user', 'admin'].includes(role)) {
            throw new Error(`Unknown role: ${role}`);
          }
        });
      },
    },
  },
};

const options = {
  sequelize,
  modelName: 'AuthUser',
  tableName: 'auth_user',
  indexes: [
    {
      name: 'uk_auth_user_email',
      unique: true,
      fields: [attributes.email.field],
    },
  ],
  ...defaultOptions,
};

AuthUser.init(attributes, options);

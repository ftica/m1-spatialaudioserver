import { DataTypes } from 'sequelize';

const attributes = {
  id: {
    field: 'id',
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true,
  },
};

const options = {
  timestamps: true,
  createdAt: 'date_created',
  updatedAt: 'date_updated',
};

export {
  attributes as defaultAttributes,
  options as defaultOptions,
};

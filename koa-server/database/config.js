import path from 'path';
import { Sequelize } from 'sequelize';

const configs = {
  development: {
    name: 'postgres',
    modelPath: path.resolve(__dirname, 'models'),
    database: 'mach1',
    schema: 'dev',
    username: 'mach1',
    password: 'mach1',
    dialect: 'postgres',
    host: '127.0.0.1',
    port: 5432,
    pool: {
      max: 10,
      min: 1,
      idle: 30000,
    },
    logging: console.log,
  },
  staging: {},
  production: {},
};

const sequelize = new Sequelize(configs[process.env.NODE_ENV || 'development']);

export {
  configs as default,
  sequelize,
};

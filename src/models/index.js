const config = require('../config/env.config');
const { Sequelize, DataTypes } = require("sequelize");

const sequelize = new Sequelize(
  config.DATABASE,
  config.DATABASE_USER,
  config.DATABASE_PASSWORD,
  {
    host: config.DATABASE_HOST,
    dialect: 'mysql',
    dialectModule: require('mysql2')
  }
);

const User = require('./user.model')(sequelize, DataTypes);

module.exports = {
  sequelize,
  User
}
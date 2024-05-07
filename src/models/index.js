const { Sequelize } = require("sequelize");
const db = {};

function initialize() {
  const config = require('../config/env.config');
  const fs = require('fs');
  const path = require('path');
  const basename = path.basename(__filename);

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
  db.sequelize = sequelize;
  
  fs
    .readdirSync(__dirname)
    .filter(file => {
      return (
        file.indexOf('.') !== 0 &&
        file !== basename &&
        file.slice(-3) === '.js' &&
        file.indexOf('.test.js') === -1
      );
    })
    .forEach(file => {
      const model = require(path.join(__dirname, file))(sequelize, Sequelize.DataTypes);
      db[model.name] = model;
    });
  
  Object.keys(db).forEach(modelName => {
    if (db[modelName].associate) {
      db[modelName].associate(db);
    }
  });
}

db.initialize = initialize;

module.exports = db;
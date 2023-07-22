const Sequelize = require('sequelize');
const path = require('path');
const { convertGlobPaths } = require('./../utils');

const configFile = require(`${__dirname}/../config/database.js`);

const env = process.env.NODE_ENV || 'development';
const config = configFile[`${env}`];

let sequelize;
if (config.use_env_variable) {
  sequelize = new Sequelize(process.env[config.use_env_variable], config);
} else {
  sequelize = new Sequelize(
    config.database,
    config.username,
    config.password,
    config
  );
}

const db = {};
const modelFiles = convertGlobPaths(['src/services/**/models/*.js']);

modelFiles.forEach((modelFile) => {
  const model = require(path.join(__dirname, '../../', modelFile))(
    sequelize,
    Sequelize.DataTypes,
    Sequelize.Model
  );
  db[model.name] = model;
});

Object.keys(db).forEach((modelName) => {
  if (db[`${modelName}`].associate) {
    db[`${modelName}`].associate(db);
  }
});

module.exports = { sequelize, db };

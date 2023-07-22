const Logger = require('./logger');
const expressLoader = require('./express');
const sequlizerLoader = require('./sequelizer');

const Loaders = async ({ expressApp }) => {
  await sequlizerLoader();
  Logger.info('✌️ DB loaded and connected!');

  await expressLoader(expressApp);
  Logger.info('✌️ Express loaded');
};

module.exports = Loaders;
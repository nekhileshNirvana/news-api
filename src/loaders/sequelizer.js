const Logger = require('./logger');
const {sequelize} = require('./sequelizerConfig');

const sequlizerLoader = async () => {
  await sequelize
    .authenticate()
    .then(() => Logger.info('Database connected...'))
    .catch((error) => Logger.info('Error:', error));
};

module.exports = sequlizerLoader;

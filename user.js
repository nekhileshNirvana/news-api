const { Sequelize, DataTypes } = require('sequelize');

// Create a Sequelize instance and connect to your MySQL database
const sequelize = new Sequelize('newsapi', 'root', '', {
  host: 'localhost',
  dialect: 'mysql'
});

// Define the User model
const User = sequelize.define('User', {
  googleId: {
    type: DataTypes.STRING,
    allowNull: false
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false
  },
  email: {
    type: DataTypes.STRING,
    allowNull: false
  },
  accessToken: {
    type: DataTypes.STRING,
    allowNull: false
  }
});

// Sync the User model with the database
sequelize.sync()
  .then(() => {
    console.log('User model synced with the database');
  })
  .catch((error) => {
    console.error('Error syncing User model:', error);
  });

module.exports = User;

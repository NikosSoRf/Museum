const { Sequelize, DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Exhibit = require('./Exhibit')(sequelize, DataTypes);
const User = require('./user')(sequelize, DataTypes);


module.exports = {
  sequelize,
  Sequelize,
  Exhibit,
  User
};
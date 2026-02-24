const { Sequelize } = require('sequelize');

module.exports = new Sequelize('museum_catalog', 'museum_user', '1234', {
  host: 'localhost',
  dialect: 'mysql',
  logging: false, 
  define: {
    timestamps: false 
  }
});

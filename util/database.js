const Sequelize = require('sequelize');

const sequelize = new Sequelize('node-complete', 'root', 'db386486', {
  dialect: 'mysql',
  host: 'localhost',
  operatorsAliases: false
});

module.exports = sequelize;

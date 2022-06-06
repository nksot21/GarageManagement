const { Sequelize } = require('sequelize');

const sequelize= new Sequelize('garage', 'root', null, {
    host: 'localhost',
    dialect: 'mysql',
    define:{
      freezeTableName: true
    }
  });

module.exports = sequelize
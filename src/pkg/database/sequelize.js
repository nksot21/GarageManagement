const { Sequelize } = require('sequelize');

const sequelize= new Sequelize('qltt', 'root','thai0868339431', {
    host: 'localhost',
    dialect: 'mysql',
    define:{
      freezeTableName: true,
    }
  });

module.exports = sequelize
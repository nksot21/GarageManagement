const { Sequelize } = require('sequelize');

const sequelize= new Sequelize('qltt', 'root', null, {
    host: 'gara-management-nmcnpm.herokuapp.com',
    dialect: 'mysql',
    define:{
      freezeTableName: true
    }
  });

module.exports = sequelize
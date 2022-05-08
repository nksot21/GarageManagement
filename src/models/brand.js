const { init } = require("express/lib/application");
const { Sequelize, Model, DataTypes } = require("sequelize");
const sequelize = require('../pkg/database/sequelize')

class brand extends Model{}

// HIỆU XE
brand.init({
    name: DataTypes.TEXT
},{
    sequelize,
    modelName: 'BRAND'
});

module.exports = brand



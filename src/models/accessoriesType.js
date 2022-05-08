const { Sequelize, Model, DataTypes } = require("sequelize");
const sequelize = require('../pkg/database/sequelize')

class accessoriesType extends Model{}

// LOẠI VẬT TƯ PHỤ TÙNG
accessoriesType.init({
    Name: DataTypes.TEXT
},{
    sequelize,
    modelName: 'ACCESSORIESTYPE'
});

module.exports = accessoriesType
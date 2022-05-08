const { Sequelize, Model, DataTypes } = require("sequelize");
const sequelize = require('../pkg/database/sequelize')

class accessories extends Model{}

// VẬT TƯ PHỤ TÙNG
accessories.init({
    Name: DataTypes.TEXT,
    UnitPrice: DataTypes.INTEGER,
    Quantity: DataTypes.INTEGER
},{
    sequelize,
    modelName: 'ACCESSORIES'
});

module.exports = accessories
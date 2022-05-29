const { Sequelize, Model, DataTypes } = require("sequelize");
const sequelize = require('../pkg/database/sequelize')

class detailedAccessories extends Model{}

// CHI TIẾT VẬT TƯ PHỤ TÙNG
detailedAccessories.init({
    Quantity: DataTypes.INTEGER,
    UnitPrice: DataTypes.INTEGER,
    TotalAmount: DataTypes.INTEGER
},{
    sequelize,
    modelName: 'ACCESSORIES_DETAIL',
    paranoid: true
});

module.exports = detailedAccessories
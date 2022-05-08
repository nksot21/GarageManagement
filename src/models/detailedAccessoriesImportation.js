const { Sequelize, Model, DataTypes } = require("sequelize");
const sequelize = require('../pkg/database/sequelize')

class detailedAccessoriesImportation extends Model{}

// CHI TIẾT NHẬP VẬT TƯ PHỤ TÙNG
detailedAccessoriesImportation.init({
    Quantity: DataTypes.INTEGER,
    UnitPrice: DataTypes.INTEGER,
    Amount: DataTypes.INTEGER
},{
    sequelize,
    modelName: 'ACCESSORIESIMPORTATION_DETAIL'
});

module.exports = detailedAccessoriesImportation
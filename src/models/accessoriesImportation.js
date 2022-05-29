const { Sequelize, Model, DataTypes } = require("sequelize");
const sequelize = require('../pkg/database/sequelize')

class accessoriesImportation extends Model{}

// PHIẾU NHẬP VẬT TƯ PHỤ TÙNG
accessoriesImportation.init({
    TotalAmount: {
        type: DataTypes.DATE,
        defaultValue: 0
    },
    Date: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW
    }
},{
    sequelize,
    modelName: 'ACCESSORIESIMPORTATION'
});

module.exports = accessoriesImportation
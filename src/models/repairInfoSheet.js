const { Sequelize, Model, DataTypes } = require("sequelize");
const sequelize = require('../pkg/database/sequelize')

class repairInfoSheet extends Model{}

// PHIẾU SỮA CHỮA
repairInfoSheet.init({
    Amount: DataTypes.INTEGER, // thành tiền
    Date: DataTypes.DATE // ngày lập phiếu
},{
    sequelize,
    modelName: 'REPAIRINFOSHEET'
});

module.exports = repairInfoSheet

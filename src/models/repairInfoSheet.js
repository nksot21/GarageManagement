const { Sequelize, Model, DataTypes } = require("sequelize");
const sequelize = require('../pkg/database/sequelize')

class repairInfoSheet extends Model{}

// PHIẾU SỮA CHỮA
repairInfoSheet.init({
    Amount: {
        type: DataTypes.INTEGER,
        defaultValue: 0
    },
    Date: {
        type : DataTypes.DATE,
        defaultValue: DataTypes.NOW
    } // ngày lập phiếu
},{
    sequelize,
    modelName: 'REPAIRINFOSHEET',
    paranoid: true
});

module.exports = repairInfoSheet

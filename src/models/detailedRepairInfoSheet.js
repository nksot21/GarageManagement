const { Sequelize, Model, DataTypes } = require("sequelize");
const sequelize = require('../pkg/database/sequelize')

class detailedRepairInfoSheet extends Model{}

// CHI TIẾT PHIẾU SỮA CHỮA
detailedRepairInfoSheet.init({
    Times: {
        type: DataTypes.INTEGER,
        defaultValue: 1
    },
    WageTotal: DataTypes.INTEGER, // tiền công
    Content: DataTypes.TEXT, 
    TotalAmount: DataTypes.INTEGER // tổng tiền 
},{
    sequelize,
    modelName: 'REPAIRINFOSHEET_DETAIL',
    paranoid: true
});

module.exports = detailedRepairInfoSheet
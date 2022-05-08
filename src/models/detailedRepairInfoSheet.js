const { Sequelize, Model, DataTypes } = require("sequelize");
const sequelize = require('../pkg/database/sequelize')

class detailedRepairInfoSheet extends Model{}

// CHI TIẾT PHIẾU SỮA CHỮA
detailedRepairInfoSheet.init({
    Times: DataTypes.INTEGER,
    WageTotal: DataTypes.INTEGER, // tiền công
    Content: DataTypes.TEXT, 
    TotalAmout: DataTypes.INTEGER // tổng tiền 
},{
    sequelize,
    modelName: 'REPAIRINFOSHEET_DETAIL'
});

module.exports = detailedRepairInfoSheet
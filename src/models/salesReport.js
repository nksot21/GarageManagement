const { Sequelize, Model, DataTypes } = require("sequelize");
const sequelize = require('../pkg/database/sequelize')

class salesReport extends Model{}

// BÁO CÁO DOANH SỐ
salesReport.init({
    Date: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW
    },
    TotalSales: DataTypes.INTEGER
},{
    sequelize,
    modelName: 'SALESREPORT'
});

module.exports = salesReport
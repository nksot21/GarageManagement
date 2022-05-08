const { Sequelize, Model, DataTypes } = require("sequelize");
const sequelize = require('../pkg/database/sequelize')

class detailedSalesReport extends Model{}

// CHI TIẾT BÁO CÁO DOANH SỐ
detailedSalesReport.init({
    RepairTimes: DataTypes.INTEGER, // lượt sửa
    Amount: DataTypes.INTEGER, // thành tiền
    Ratio: DataTypes.FLOAT // tỉ lệ
},{
    sequelize,
    modelName: 'SALESREPORT_DETAIL'
});

module.exports = detailedSalesReport
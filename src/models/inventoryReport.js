const { Sequelize, Model, DataTypes } = require("sequelize");
const sequelize = require('../pkg/database/sequelize')

class inventoryReport extends Model{}

// BÁO CÁO TỒN
inventoryReport.init({
    Date: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW
    },
    InitialQuantity: DataTypes.INTEGER,
    Arising: DataTypes.INTEGER,
    FinalQuantity: DataTypes.INTEGER
},{
    sequelize,
    modelName: 'INVENTORYREPORT'
});

module.exports = inventoryReport
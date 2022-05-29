const { Sequelize, Model, DataTypes } = require("sequelize");
const sequelize = require('../pkg/database/sequelize')

class inventoryReport extends Model{}

// BÁO CÁO TỒN
inventoryReport.init({
    Month: {
        type: DataTypes.INTEGER
    },
    Year: {
        type: DataTypes.INTEGER
    },
    InitialQuantity: {
        type: DataTypes.INTEGER,
        defaultValue: 0
    },
    Arising: {
        type: DataTypes.INTEGER,
        defaultValue: 0
    },
    UsedQuantity: {
        type: DataTypes.INTEGER,
        defaultValue: 0
    },
    ImportedQuantity: {
        type: DataTypes.INTEGER,
        defaultValue: 0
    },
    FinalQuantity: {
        type: DataTypes.INTEGER,
        defaultValue: 0
    }
},{
    sequelize,
    modelName: 'INVENTORYREPORT'
});

module.exports = inventoryReport
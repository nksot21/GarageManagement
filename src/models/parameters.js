const { Sequelize, Model, DataTypes } = require("sequelize");
const sequelize = require('../pkg/database/sequelize')

class parameter extends Model{}

// THAM SỐ
parameter.init({
    CarReceivedperDay: {
        type: DataTypes.INTEGER,
        defaultValue: 30
    },
    SaleRatio:{
        type: DataTypes.FLOAT,
        defaultValue: 1.2
    }
},{
    sequelize,
    modelName: 'PARAMETER'
});

module.exports = parameter
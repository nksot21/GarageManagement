const { init } = require("express/lib/application");
const { Sequelize, Model, DataTypes } = require("sequelize");
const sequelize = require('../pkg/database/sequelize')

class car extends Model { }

// XE
car.init({
    LicensePlate: DataTypes.TEXT, // biển số
    ReceivedDate: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW
    },
    Debt: DataTypes.INTEGER
}, {
    sequelize,
    modelName: 'CAR',
});

module.exports = car

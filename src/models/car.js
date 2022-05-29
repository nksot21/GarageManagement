const { init } = require("express/lib/application");
const { Sequelize, Model, DataTypes } = require("sequelize");
const sequelize = require('../pkg/database/sequelize')

class car extends Model { }

// XE
car.init({
    LicensePlate: {
        type: DataTypes.TEXT,
        unique: true
    }, // biển số
    ReceivedDate: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW
    },
    Debt: {
        type: DataTypes.INTEGER,
        defaultValue: 0
    }
}, {
    sequelize,
    modelName: 'CAR',
});

module.exports = car

const { Sequelize, Model, DataTypes } = require("sequelize");
const sequelize = require('../pkg/database/sequelize')

class customer extends Model{}

// KHÁCH HÀNG
// PHONE_NUMBER and EMAIL is UNIQUE
customer.init({
    Name: DataTypes.TEXT,
    Address: DataTypes.TEXT,
    PhoneNumber: {
        type: DataTypes.TEXT,
        unique: true
    },
    Email: {
        type: DataTypes.TEXT,
        unique: true
    }
},{
    sequelize,
    modelName: 'CUSTOMER'
});

module.exports = customer
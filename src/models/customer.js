const { Sequelize, Model, DataTypes } = require("sequelize");
const sequelize = require('../pkg/database/sequelize')

class customer extends Model{}

// KHÁCH HÀNG
customer.init({
    Name: DataTypes.TEXT,
    Address: DataTypes.TEXT,
    PhoneNumber: DataTypes.TEXT,
    Email: DataTypes.TEXT
},{
    sequelize,
    modelName: 'CUSTOMER'
});

module.exports = customer
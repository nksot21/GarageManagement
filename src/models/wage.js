const { Sequelize, Model, DataTypes } = require("sequelize");
const sequelize = require('../pkg/database/sequelize')

class wage extends Model{}

// TIỀN CÔNG
wage.init({
    Name: DataTypes.TEXT,
    Value: DataTypes.INTEGER
},{
    sequelize,
    modelName: 'WAGE'
});

module.exports = wage
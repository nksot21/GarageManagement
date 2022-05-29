const { Sequelize, Model, DataTypes } = require("sequelize");
const sequelize = require('../pkg/database/sequelize')

class carReceiveSheet extends Model{}

carReceiveSheet.init({
    ReceivedDate: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW
    }
},{
    sequelize,
    modelName: 'CARRECEIVESHEET',
    paranoid: true
});

module.exports = carReceiveSheet
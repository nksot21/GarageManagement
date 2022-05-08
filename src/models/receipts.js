const { database } = require("pg/lib/defaults");
const { Sequelize, Model, DataTypes } = require("sequelize");
const sequelize = require('../pkg/database/sequelize')

class receipts extends Model {}
    
// PHIẾU THU TIỀN
receipts.init({
    Date: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW
    },
    Amount: DataTypes.INTEGER // số tiền thu
  }, {sequelize, modelName: 'RECEIPTS' });

/*(async () => {
  await sequelize.sync({ force: true });
  // Code here
})();*/

module.exports = receipts
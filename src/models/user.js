const { Sequelize, Model, DataTypes } = require("sequelize");
const sequelize = require('../pkg/database/sequelize')
//const sequelize = database.sequelize

/*const sequelize= new Sequelize('gara', 'root', null, {
  host: 'localhost',
  dialect: 'mysql',
});*/

/*const User = sequelize.define("user", {
  name: DataTypes.TEXT,
  favoriteColor: {
    type: DataTypes.TEXT,
    defaultValue: 'green'
  },
  age: DataTypes.INTEGER,
  cash: DataTypes.INTEGER
});*/

// 0. DB Admin
// 1. Manage
// 2. User

class User extends Model {}

User.init({
    /*id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true
    },*/
    Username: DataTypes.STRING,
    Email: {
      type: DataTypes.TEXT,
      unique: true
    },
    Password: DataTypes.TEXT,
    Permission: {
      type: DataTypes.INTEGER,
      defaultValue: 2
    }
  }, {sequelize, modelName: 'USER' });

/*(async () => {
  await sequelize.sync({ force: true });
  // Code here
})();*/

module.exports = User
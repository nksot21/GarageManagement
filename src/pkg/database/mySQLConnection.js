const mysql = require('mysql2');
const { Sequelize } = require('sequelize');
const sequelize = require('./sequelize')
const association = require('../../models/association')

/*const connection = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "",
    port: 3306,
});

connection.connect(function(err) {
    if(err) throw err;
    console.log("connected");
})*/

/*var pool  = mysql.createPool({
  connectionLimit : 10,
  host            : 'localhost',
  user            : 'root',
  password        : '',
  database        : 'gara'
});
 
pool.query('SELECT 1 + 1 AS solution', function (error, results, fields) {
  if (error) throw error;
  console.log('The solution is: ', results[0].solution);
});*/


var database = {
    connection: {
        isConnect: async () => {
            try {
                await sequelize.authenticate();
                console.log('Connection has been established successfully.');
            } catch (error) {
                console.error('Unable to connect to the database:', error);
            }
        },
        migration: async () => {
            try{
                association();
                await sequelize.sync({force:true})
                

            }catch(err){
                console.log(err)
            }
        }
    }
}



module.exports = database
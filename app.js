const express = require('express')
const app = express()
const bodyParser = require('body-parser')
const mysql = require('mysql2')
const sequelizeCon = require('./src/pkg/database/mySQLConnection')
const siteRoute = require('./src/routes/site')
const userRoute = require('./src/routes/user')
const { Sequelize, Model, DataTypes } = require('sequelize');
const authen = require('./src/pkg/middleware/authen')
const sequelize = require('./src/pkg/database/sequelize')
const khachHangRoute = require('./src/routes/KhachHang')
const carRoute = require('./src/routes/Car')
const carTypeRoute = require('./src/routes/HieuXe')

//SET UP BODY-PARSER
app.use(bodyParser.urlencoded({ extended: false }));
// parse application/json
app.use(bodyParser.json());


require('dotenv').config()

//SET UP POSTGRES-DATABASE
/*var connection = mysql.createConnection({
    host:'localhost',
    user:'',
    password: '',
    database: 'my_db'
})

connection.connect(function(err) {
    if (err) {
        console.log("err: ", err)
        return;
    }
    console.log("connected")
});*/


//MYSQL CONNECTION
//mysqlCon.query();
sequelizeCon.connection.isConnect();
sequelizeCon.connection.migration();

// create

/*var create = async function() {
    const jane = await userModel.create({ name: "Jane" });
    // Jane exists in the database now!
    
    console.log(jane instanceof User); // true
    console.log(jane.name); // "Jane"
}
create();*/




/*class User extends Model {}
User.init({
  username: DataTypes.STRING,
  birthday: DataTypes.DATE
}, { sequelize, modelName: 'user' });*/

app.use("/user", userRoute)
app.use("/khachhang", khachHangRoute)
app.use("/car", carRoute )
app.use("/cartype", carTypeRoute)
//app.use("/", authen, siteRoute)



app.listen(3000, () => {
    console.log("hello")
})
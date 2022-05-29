const express = require('express')
const app = express()
const bodyParser = require('body-parser')
const mysql = require('mysql2')

// REQUIRE DATABASE CONNECTION
const sequelizeCon = require('./src/pkg/database/mySQLConnection')

// REQUIRE ROUTE
const siteRoute = require('./src/routes/site')
const userRoute = require('./src/routes/user')
const khachHangRoute = require('./src/routes/KhachHang')
const carRoute = require('./src/routes/Car')
const carTypeRoute = require('./src/routes/HieuXe')
const databaseAdminRoute = require('./src/routes/databaseAdmin')
const paramsRoute = require('./src/routes/parametersRoute')
const carReceiveRoute = require('./src/routes/carReceiveRoute')
const repairInfoSheet = require('./src/routes/repairInfoSheet')
const brandRoute = require('./src/routes/brandRoute')
const wageRoute = require('./src/routes/wageRoute')
const accessoriesTypeRoute = require('./src/routes/accessoryTypeRoute')
const accessoriesRoute = require('./src/routes/accessoriesRoute')
const importationRoute = require('./src/routes/importationRoute')
const salesReportRoute = require('./src/routes/salesReportRoute')
const inventoryReportRoute = require('./src/routes/inventoryReportRoute')
const collectmoneyRoute = require('./src/routes/collectMoneyRoute')
const searchCarRoute = require('./src/routes/searchCarRoute')

// REQUIRE MIDDLEWARE
const dbAdminPermissionMiddleWare = require('./src/pkg/middleware/databaseAdmin')
const managePermissionMiddleWare = require('./src/pkg/middleware/manager')
const authen = require('./src/pkg/middleware/authen')

//SET UP BODY-PARSER
app.use(bodyParser.urlencoded({ extended: false }));
// parse application/json
app.use(bodyParser.json());


require('dotenv').config()

//MYSQL CONNECTION
sequelizeCon.connection.isConnect();
sequelizeCon.connection.migration();

app.use("/user", userRoute)
app.use("/khachhang", khachHangRoute)
app.use("/car", carRoute )
app.use("/cartype", carTypeRoute)
app.use("/carReceive", carReceiveRoute )
app.use("/repair", repairInfoSheet)
app.use("/brand", brandRoute)
app.use("/wage", wageRoute)
app.use("/type", accessoriesTypeRoute)
app.use("/accessories", accessoriesRoute)
app.use("/importation", importationRoute)
app.use("/salesreport", salesReportRoute)
app.use("/inventory", inventoryReportRoute)
app.use("/seachcar", searchCarRoute)
app.use("/moneycollection", collectmoneyRoute)
app.use("/admin", dbAdminPermissionMiddleWare, databaseAdminRoute)
//managePermissionMiddleWare
app.use("/params",paramsRoute)
app.use("/", authen, siteRoute)

app.listen(3000, () => {
    console.log("hello")
})
const express = require("express")
const route = express.Router()
const accessoriesimportation= require('../controllers/accessoriesimportationController')

route.post("/", accessoriesimportation.importspareparts)

module.exports = route
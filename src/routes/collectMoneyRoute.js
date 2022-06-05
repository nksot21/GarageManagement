const express = require("express")
const route = express.Router()
const collectmoneyController = require('../controllers/userController/collectMoneyController')
route.get("/", collectmoneyController.getAll)
route.post("/search", collectmoneyController.find_collectmoney)
route.post("/", collectmoneyController.collectmoney)

module.exports = route
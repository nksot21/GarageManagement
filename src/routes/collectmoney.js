const express = require("express")
const route = express.Router()
const collectmoneyController = require('../controllers/collectmoneyController.js')
route.post("/search", collectmoneyController.find_collectmoney)
route.post("/", collectmoneyController.collectmoney)

module.exports = route
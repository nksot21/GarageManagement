const express = require("express")
const route = express.Router()
const collectmoneyController = require('../controllers/collectmoneyController.js')

route.post("/", collectmoneyController.collectmoney)

module.exports = route
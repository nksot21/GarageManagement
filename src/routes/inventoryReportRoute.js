const express = require("express");
const route = express.Router();

const inventoryReportController = require('../controllers/userController/inventoryReportController')

route.post('/', inventoryReportController.create)
route.post('/get', inventoryReportController.getByMonth)

module.exports = route
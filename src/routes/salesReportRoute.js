const express = require("express");
const route = express.Router();
const salesReportController = require('../controllers/userController/salesReport')

route.post('/', salesReportController.getbyMonth)

module.exports = route
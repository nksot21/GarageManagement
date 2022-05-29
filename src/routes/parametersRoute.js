const express = require("express");
const route = express.Router();

const paramsController = require('../controllers/userController/parametersController')

route.post('/', paramsController.create)
route.put('/car', paramsController.updateCarReceivedperDay)
route.put('/ratio', paramsController.updateSaleRatio)
route.get('/', paramsController.get)


module.exports = route
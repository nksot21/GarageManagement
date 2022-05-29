const express = require("express");
const route = express.Router();

const carReceiveController = require('../controllers/userController/carReceived')

route.post('/', carReceiveController.create)
route.get('/', carReceiveController.getAll)
route.get('/:customerID', carReceiveController.getByCustomerPN)
route.put('/:id', carReceiveController.update)
route.delete('/:id', carReceiveController.delete)

module.exports = route
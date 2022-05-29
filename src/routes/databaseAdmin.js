const express = require("express");
const route = express.Router();
const roleController = require('../controllers/databaseAdminController/role')
const carReceivedController = require("../controllers/databaseAdminController/carReceived")

route.put('/:userid', roleController.updateRole)
route.delete('/carreceive/:id', carReceivedController.delete)

module.exports = route
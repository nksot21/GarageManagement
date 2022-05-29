const express = require("express");
const route = express.Router();

const importationController  = require('../controllers/userController/importationController')

route.post('/', importationController.create)
route.get('/', importationController.getAll)

module.exports = route
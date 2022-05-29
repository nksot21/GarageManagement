const express = require("express");
const route = express.Router();
const wageController = require('../controllers/userController/wageController');

route.post('/', wageController.create)
route.get('/', wageController.getAll)
route.delete('/:wageid', wageController.delete)

module.exports = route
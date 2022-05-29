const express = require("express");
const route = express.Router();
const accessoriesController = require('../controllers/userController/accessoryController')

route.post('/', accessoriesController.create)
route.get('/', accessoriesController.getAll)
route.delete('/:id', accessoriesController.delete)

module.exports = route
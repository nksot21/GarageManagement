const express = require("express");
const route = express.Router();

const accessoriesTypeController = require('../controllers/userController/accessoryType')

route.post('/', accessoriesTypeController.create)
route.get('/', accessoriesTypeController.getAll)
route.delete('/:accessorytypeid', accessoriesTypeController.delete)

module.exports = route
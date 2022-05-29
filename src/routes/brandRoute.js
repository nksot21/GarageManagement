const { Router } = require("express");
const express = require("express");
const route = express.Router();

const brandController = require('../controllers/userController/brandController')

route.post('/', brandController.create)
route.get('/', brandController.getAll)
route.delete('/:brandid', brandController.detele)

module.exports = route
const express = require("express");
const route = express.Router();

const carController = require('../controllers/userController/carController')

route.get('/', carController.getAll)
route.post('/search', carController.getByLicense)

module.exports = route
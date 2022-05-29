const express = require("express");
const route = express.Router();
const siteController = require('../controllers/userController/siteController')

route.get("/", siteController.getHome);

module.exports = route;
const express = require("express");
const route = express.Router();
const searchcarController = require('../controllers/userController/searchCarController')

// route.post("/", userController.createUser )
// route.get("/", userController.getUsers)
// route.post("/username", userController.getUsersByName)
route.post("/", searchcarController.getseach)

module.exports = route
const express = require("express");
const route = express.Router();
const userController = require('../controllers/user.js')

route.post("/", userController.createUser )
route.get("/", userController.getUsers)
route.post("/username", userController.getUsersByName)
route.post("/signin", userController.signin)


module.exports = route
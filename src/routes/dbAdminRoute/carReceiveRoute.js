const express = require("express");
const route = express.Router();
const databaseAdminController = require("../../controllers/databaseAdminController/carReceived")

route.delete("/:id", databaseAdminController)
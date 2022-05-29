const express = require("express");
const route = express.Router();

const repairInfoSheetController = require("../../src/controllers/userController/repairInfoSheet")

route.post("/", repairInfoSheetController.create)
route.get("/all", repairInfoSheetController.getAll)
route.get("/alldetail", repairInfoSheetController.getAllDetail)
route.get("/:license", repairInfoSheetController.getByLP)
route.delete("/:id", repairInfoSheetController.delete)

module.exports = route
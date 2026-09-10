const express = require("express");
const { create } = require("../controllers/location.controller");
const { getAll, update, getById } = require("../controllers/location.controller");

const Route = express.Router();

Route.post("/create", create);
Route.get("/find",getAll)
Route.put("/update",update)
Route.get("/findbyid",getById)


module.exports = Route;
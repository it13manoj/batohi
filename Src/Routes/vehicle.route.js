const express = require("express");
const { create, getfind, getByVehicleType, getByVehicleId,} = require("../controllers/vehicle.controller");

const Route = express.Router();

Route.post("/create", create);
Route.post("/find",getByVehicleId);
 

module.exports = Route;
const express = require("express");
const { create, getfind, getByVehicleType, getByVehicleId, findByDriver,} = require("../controllers/vehicle.controller");
const authMiddleware = require("../Middleware/auth.middleware");

const Route = express.Router();

Route.post("/create", authMiddleware , create);
Route.get("/find",authMiddleware , getByVehicleId);
Route.get("/findBydriver",authMiddleware , findByDriver);

module.exports = Route;
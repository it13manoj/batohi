const express = require("express");
const { create, listRides } = require("../controllers/trip.controller");
const { searchRide } = require("../controllers/trip.controller");

const Route = express.Router();
Route.post("/create", create);
Route.post("/searchride",searchRide)
Route.get("/listofride", listRides)


module.exports = Route;
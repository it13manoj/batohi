const express = require("express");
const { create, bookride, getAllBookedRides, bookedHistory } = require("../controllers/booking.controller");

const Route = express.Router();

Route.post("/create", create);
Route.post("/bookride", bookride);
Route.get("/allrides", getAllBookedRides);
Route.get("/bookedhistory/:customer_id", bookedHistory)



module.exports = Route;

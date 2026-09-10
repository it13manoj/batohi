const express = require("express");
const { create } = require("../controllers/bookingItem")

const Route = express.Router();

Route.post("/create", create);


module.exports = Route;
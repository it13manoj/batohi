const express = require("express");
const { create } = require("../controllers/review.controller");

const Route = express.Router();

Route.post("/create", create);


module.exports = Route;
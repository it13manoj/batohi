const express = require("express");
const { create } = require("../controllers/driver.controller");
const { login, profile } = require("../controllers/driver.controller");

const Route = express.Router();

Route.post("/create", create);
Route.post("/login",login)
Route.post("/profile",profile),



module.exports = Route; 
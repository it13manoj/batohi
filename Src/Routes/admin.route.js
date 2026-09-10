const express = require("express");
const { create } = require("../controllers/admin.controller");

const Route = express.Router();

Route.post("/create", create);


module.exports = Route;
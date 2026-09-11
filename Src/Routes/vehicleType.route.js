const express = require("express");
const { create, getType } = require("../controllers/vehicleType.controller");
const authMiddleware = require("../Middleware/auth.middleware");

const Route = express.Router();

Route.post("/create",authMiddleware,  create);
Route.get("/vehicle-types",authMiddleware,  getType);

module.exports = Route;
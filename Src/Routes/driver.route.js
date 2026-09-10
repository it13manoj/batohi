const express = require("express");
const { create, getProfile, login, profile } = require("../controllers/driver.controller");
const authMiddleware = require("../Middleware/auth.middleware");


const Route = express.Router();

Route.post("/create", create);
Route.post("/login",login)
Route.post("/profile",authMiddleware, profile),
Route.get("/profile", authMiddleware, getProfile),



module.exports = Route; 
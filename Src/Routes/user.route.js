const express = require("express");
const { create, login, find, update, Delete, destroy, findById, profile, getProfile, searchRide, updateLocation, findNearestDrivers, deviceToken } = require("../controllers/user.controller");
const authMiddleware = require("../Middleware/auth.middleware");
const {upload} = require("../Utils/upload");

const Route = express.Router();


Route.post("/create", create);
Route.post("/login", login);
Route.post("/profile",authMiddleware, upload.single("profileImage") ,profile);
Route.get("/profile",authMiddleware, getProfile);
Route.get("/find", find);
Route.get("/findbyid", authMiddleware, findById);
Route.put("/update/:id", update);
Route.delete("/delete", destroy)
Route.post('/update-location', authMiddleware, updateLocation);
// Express route definition
Route.get("/nearest", authMiddleware, findNearestDrivers);
Route.post("/device/token", authMiddleware, deviceToken);
module.exports = Route;
 
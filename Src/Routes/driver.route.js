const express = require("express");
const { create, getProfile, login, profile, dashboard, status, findRider, listOfBookedUsers, acceptRide, rejectRide } = require("../controllers/driver.controller");
const authMiddleware = require("../Middleware/auth.middleware");
const { upload } = require("../Utils/upload");


const Route = express.Router();

Route.post("/create", create);
Route.post("/login",login)
Route.post("/profile",authMiddleware, upload.fields([
        {
            name: "profileImage",
            maxCount: 1
        },
        {
            name: "adharImage",
            maxCount: 1
        },
        {
            name: "panCard",
            maxCount: 1
        },
         {
            name: "licenseImage",
            maxCount: 1
        }
    ]), profile),
Route.get("/profile", authMiddleware, getProfile)
Route.get("/dashboard", authMiddleware, dashboard)
Route.post("/:id/status", authMiddleware, status)
Route.post("/:id/find-ride", authMiddleware, findRider)
Route.get("/find/pending/ride", authMiddleware, listOfBookedUsers)
Route.put('/accept-ride/:bookingId', authMiddleware, acceptRide)
Route.put('/reject-ride/:bookingId', authMiddleware, rejectRide)
module.exports = Route; 
const express = require("express");
const { create, getProfile, login, profile, dashboard, status, findRider, listOfBookedUsers, acceptRide, rejectRide, bookedStatus, booked, startRide, bothLocation, completeRide, cancelRide } = require("../controllers/driver.controller");
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
Route.get("/bookings/status/:id", authMiddleware, bookedStatus)

Route.get("/find/all/ride", authMiddleware, booked)
Route.post("/start/ride", authMiddleware, startRide)
Route.get("/pick/location", authMiddleware, bothLocation)
Route.put('/complete-ride/:bookingId', authMiddleware, completeRide)
Route.put('/cancel/:bookingId', authMiddleware, cancelRide)

module.exports = Route; 
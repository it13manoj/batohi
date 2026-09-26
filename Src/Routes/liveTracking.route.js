const express = require("express");
const {
    recordLocation,
    confirmPickup,
    getLiveTracking,
    getTrackingHistory,
    completeRideTracking
} = require("../controllers/liveTracking.controller");
const authMiddleware = require("../Middleware/auth.middleware");

const router = express.Router();

// 1. Insert / Update current live location of driver during ride
router.post("/update", authMiddleware, recordLocation);
router.post("/insert", authMiddleware, recordLocation);

// 2. Confirm user pickup and start live tracking
router.post("/confirm-pickup", authMiddleware, confirmPickup);

// 3. Get current live tracking details for rider/driver
router.get("/live/:bookingId", authMiddleware, getLiveTracking);
router.get("/:bookingId", authMiddleware, getLiveTracking);

// 4. Get breadcrumb history for route polyline on map
router.get("/history/:bookingId", authMiddleware, getTrackingHistory);

// 5. Complete ride tracking when destination is reached
router.post("/complete", authMiddleware, completeRideTracking);

module.exports = router;

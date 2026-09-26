const { LiveTracking, Booked, User, Driver, Vehicle, VehicleType } = require("../Models/index");
const { Op } = require("sequelize");

// Helper: Calculate Haversine distance in kilometers
const calculateDistanceKm = (lat1, lon1, lat2, lon2) => {
    if (!lat1 || !lon1 || !lat2 || !lon2) return 0;
    const R = 6371; // Earth's radius in km
    const dLat = (lat2 - lat1) * (Math.PI / 180);
    const dLon = (lon2 - lon1) * (Math.PI / 180);
    const a =
        Math.sin(dLat / 2) * Math.sin(dLat / 2) +
        Math.cos(lat1 * (Math.PI / 180)) *
        Math.cos(lat2 * (Math.PI / 180)) *
        Math.sin(dLon / 2) *
        Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return parseFloat((R * c).toFixed(2));
};

/**
 * 1. Insert / Record Live Location
 * Used by driver app to push real-time GPS coordinates for rider live tracking after pickup confirmation.
 */
exports.recordLocation = async (req, res) => {
    try {
        const {
            booking_id,
            driver_id,
            user_id,
            latitude,
            longitude,
            current_latitude,
            current_longitude,
            heading,
            speed,
            accuracy,
            altitude,
            distance_remaining_km,
            estimated_arrival_minutes,
            pickup_status = "in_transit",
            battery_percentage
        } = req.body;

        const currentLat = current_latitude !== undefined ? current_latitude : latitude;
        const currentLng = current_longitude !== undefined ? current_longitude : longitude;

        // Validation
        if (!booking_id) {
            return res.status(400).json({
                success: false,
                message: "booking_id is required"
            });
        }

        if (currentLat === undefined || currentLng === undefined) {
            return res.status(400).json({
                success: false,
                message: "Current coordinates (latitude and longitude) are required"
            });
        }

        // 1. Verify Booking exists
        const booking = await Booked.findByPk(booking_id);
        if (!booking) {
            return res.status(404).json({
                success: false,
                message: "Booking record not found"
            });
        }

        // Verify pickup is confirmed or ride is in progress
        const validStatuses = ["confirmed", "accepted", "in_transit"];
        if (!validStatuses.includes(booking.status)) {
            return res.status(400).json({
                success: false,
                message: `Live tracking is only available after pickup confirmation. Current booking status is '${booking.status}'`
            });
        }

        const resolvedDriverId = driver_id || (req.user && req.user.id) || booking.driver_id;
        const resolvedUserId = user_id || booking.user_id;

        const parsedLat = parseFloat(currentLat);
        const parsedLng = parseFloat(currentLng);

        // Calculate remaining distance to destination if drop coordinates are available
        let remainingKm = distance_remaining_km;
        let etaMinutes = estimated_arrival_minutes;

        if (remainingKm === undefined && booking.latitude_to && booking.longitude_to) {
            remainingKm = calculateDistanceKm(
                parsedLat,
                parsedLng,
                parseFloat(booking.latitude_to),
                parseFloat(booking.longitude_to)
            );

            if (etaMinutes === undefined) {
                // Average urban speed ~ 30 km/h
                etaMinutes = Math.max(1, Math.ceil((remainingKm / 30) * 60));
            }
        }

        // 2. Insert new live tracking point
        const trackingRecord = await LiveTracking.create({
            booking_id: booking.id,
            driver_id: resolvedDriverId,
            user_id: resolvedUserId,
            current_latitude: parsedLat,
            current_longitude: parsedLng,
            heading: heading !== undefined ? parseFloat(heading) : null,
            speed: speed !== undefined ? parseFloat(speed) : null,
            accuracy: accuracy !== undefined ? parseFloat(accuracy) : null,
            altitude: altitude !== undefined ? parseFloat(altitude) : null,
            distance_remaining_km: remainingKm !== undefined ? parseFloat(remainingKm) : null,
            estimated_arrival_minutes: etaMinutes !== undefined ? parseInt(etaMinutes) : null,
            pickup_status: pickup_status,
            is_active: true,
            battery_percentage: battery_percentage !== undefined ? parseInt(battery_percentage) : null,
            recorded_at: new Date()
        });

        // 3. Update Driver's real-time position in User table
        if (resolvedDriverId) {
            await User.update(
                {
                    latitude: parsedLat,
                    longitude: parsedLng,
                    last_located_at: new Date()
                },
                {
                    where: { id: resolvedDriverId }
                }
            );
        }

        // 4. Update booking status to in_transit if it was confirmed
        if (booking.status === "confirmed" && pickup_status === "in_transit") {
            await Booked.update(
                { status: "confirmed" },
                { where: { id: booking.id } }
            );
        }

        return res.status(201).json({
            success: true,
            message: "Live location recorded successfully",
            data: trackingRecord
        });

    } catch (error) {
        console.error("Record Live Location Error:", error);
        return res.status(500).json({
            success: false,
            message: "Failed to record live location",
            error: error.message
        });
    }
};

/**
 * 2. Confirm Pickup and Initialize Live Tracking
 * Explicit endpoint for confirming user pickup by the driver and logging the initial tracking point.
 */
exports.confirmPickup = async (req, res) => {
    try {
        const { booking_id, latitude, longitude, heading, speed } = req.body;
        const driverId = (req.user && req.user.id) || req.body.driver_id;

        if (!booking_id) {
            return res.status(400).json({
                success: false,
                message: "booking_id is required"
            });
        }

        const booking = await Booked.findByPk(booking_id);
        if (!booking) {
            return res.status(404).json({
                success: false,
                message: "Booking not found"
            });
        }

        // Update booking status to confirmed (rider picked up)
        await Booked.update(
            { status: "confirmed" },
            { where: { id: booking_id } }
        );

        let initialTracking = null;
        if (latitude !== undefined && longitude !== undefined) {
            const parsedLat = parseFloat(latitude);
            const parsedLng = parseFloat(longitude);

            let remainingKm = null;
            let etaMinutes = null;
            if (booking.latitude_to && booking.longitude_to) {
                remainingKm = calculateDistanceKm(
                    parsedLat,
                    parsedLng,
                    parseFloat(booking.latitude_to),
                    parseFloat(booking.longitude_to)
                );
                etaMinutes = Math.max(1, Math.ceil((remainingKm / 30) * 60));
            }

            initialTracking = await LiveTracking.create({
                booking_id: booking.id,
                driver_id: driverId || booking.driver_id,
                user_id: booking.user_id,
                current_latitude: parsedLat,
                current_longitude: parsedLng,
                heading: heading !== undefined ? parseFloat(heading) : null,
                speed: speed !== undefined ? parseFloat(speed) : null,
                distance_remaining_km: remainingKm,
                estimated_arrival_minutes: etaMinutes,
                pickup_status: "pickup_confirmed",
                is_active: true,
                recorded_at: new Date()
            });

            if (driverId) {
                await User.update(
                    {
                        latitude: parsedLat,
                        longitude: parsedLng,
                        last_located_at: new Date()
                    },
                    { where: { id: driverId } }
                );
            }
        }

        return res.status(200).json({
            success: true,
            message: "User pickup confirmed. Live tracking started.",
            booking_id: booking_id,
            status: "confirmed",
            tracking: initialTracking
        });

    } catch (error) {
        console.error("Confirm Pickup Error:", error);
        return res.status(500).json({
            success: false,
            message: "Failed to confirm pickup",
            error: error.message
        });
    }
};

/**
 * 3. Get Current Live Tracking for a Ride
 * Used by rider/driver/admin to view real-time location, ETA, and progress.
 */
exports.getLiveTracking = async (req, res) => {
    try {
        const bookingId = req.params.bookingId || req.query.booking_id;

        if (!bookingId) {
            return res.status(400).json({
                success: false,
                message: "bookingId parameter is required"
            });
        }

        // Fetch booking with rider and driver details
        const booking = await Booked.findByPk(bookingId, {
            include: [
                {
                    model: User,
                    as: "rider",
                    attributes: ["id", "username", "email", "mobile_no"]
                },
                {
                    model: User,
                    as: "driver",
                    attributes: ["id", "username", "email", "mobile_no", "latitude", "longitude"]
                }
            ]
        });

        if (!booking) {
            return res.status(404).json({
                success: false,
                message: "Booking not found"
            });
        }

        // Get latest location tracking record
        const latestTracking = await LiveTracking.findOne({
            where: {
                booking_id: bookingId,
                is_active: true
            },
            order: [["recorded_at", "DESC"]]
        });

        // Current coordinates (prefer latest tracking point, fallback to driver's user coordinates)
        const currentLat = latestTracking
            ? parseFloat(latestTracking.current_latitude)
            : (booking.driver && booking.driver.latitude ? parseFloat(booking.driver.latitude) : null);

        const currentLng = latestTracking
            ? parseFloat(latestTracking.current_longitude)
            : (booking.driver && booking.driver.longitude ? parseFloat(booking.driver.longitude) : null);

        let distanceRemainingKm = latestTracking ? latestTracking.distance_remaining_km : null;
        let estimatedArrivalMinutes = latestTracking ? latestTracking.estimated_arrival_minutes : null;

        // Recalculate if coordinates are present and drop coordinates exist
        if (currentLat && currentLng && booking.latitude_to && booking.longitude_to) {
            const calculatedDist = calculateDistanceKm(
                currentLat,
                currentLng,
                parseFloat(booking.latitude_to),
                parseFloat(booking.longitude_to)
            );
            distanceRemainingKm = calculatedDist;
            estimatedArrivalMinutes = Math.max(1, Math.ceil((calculatedDist / 30) * 60));
        }

        // Fetch vehicle details for the driver
        let vehicleDetails = null;
        if (booking.driver_id) {
            const driverProfile = await Driver.findOne({
                where: { user_id: booking.driver_id },
                include: [
                    {
                        model: Vehicle,
                        as: "vehicle",
                        include: [
                            {
                                model: VehicleType,
                                as: "vehicleType"
                            }
                        ]
                    }
                ]
            });
            if (driverProfile) {
                vehicleDetails = driverProfile.vehicle;
            }
        }

        return res.status(200).json({
            success: true,
            message: "Live tracking data fetched successfully",
            data: {
                booking_id: booking.id,
                status: booking.status,
                pickup_location: {
                    address: booking.from,
                    latitude: booking.latitude_from ? parseFloat(booking.latitude_from) : null,
                    longitude: booking.longitude_from ? parseFloat(booking.longitude_from) : null
                },
                dropoff_location: {
                    address: booking.to,
                    latitude: booking.latitude_to ? parseFloat(booking.latitude_to) : null,
                    longitude: booking.longitude_to ? parseFloat(booking.longitude_to) : null
                },
                current_location: {
                    latitude: currentLat,
                    longitude: currentLng,
                    heading: latestTracking ? latestTracking.heading : null,
                    speed: latestTracking ? latestTracking.speed : null,
                    accuracy: latestTracking ? latestTracking.accuracy : null,
                    recorded_at: latestTracking ? latestTracking.recorded_at : null
                },
                trip_progress: {
                    distance_remaining_km: distanceRemainingKm,
                    estimated_arrival_minutes: estimatedArrivalMinutes,
                    pickup_status: latestTracking ? latestTracking.pickup_status : "pickup_confirmed"
                },
                rider: booking.rider,
                driver: booking.driver,
                vehicle: vehicleDetails
            }
        });

    } catch (error) {
        console.error("Get Live Tracking Error:", error);
        return res.status(500).json({
            success: false,
            message: "Failed to fetch live tracking",
            error: error.message
        });
    }
};

/**
 * 4. Get Tracking History (Breadcrumbs)
 * Returns all GPS coordinate points for drawing route polyline on map.
 */
exports.getTrackingHistory = async (req, res) => {
    try {
        const bookingId = req.params.bookingId || req.query.booking_id;

        if (!bookingId) {
            return res.status(400).json({
                success: false,
                message: "bookingId parameter is required"
            });
        }

        const history = await LiveTracking.findAll({
            where: { booking_id: bookingId },
            attributes: [
                "id",
                "current_latitude",
                "current_longitude",
                "heading",
                "speed",
                "pickup_status",
                "recorded_at"
            ],
            order: [["recorded_at", "ASC"]]
        });

        return res.status(200).json({
            success: true,
            count: history.length,
            booking_id: bookingId,
            data: history
        });

    } catch (error) {
        console.error("Get Tracking History Error:", error);
        return res.status(500).json({
            success: false,
            message: "Failed to fetch tracking history",
            error: error.message
        });
    }
};

/**
 * 5. Complete Live Tracking
 * Marks tracking as completed when destination is reached.
 */
exports.completeRideTracking = async (req, res) => {
    try {
        const { booking_id } = req.body;

        if (!booking_id) {
            return res.status(400).json({
                success: false,
                message: "booking_id is required"
            });
        }

        // Deactivate active tracking points
        await LiveTracking.update(
            {
                is_active: false,
                pickup_status: "completed"
            },
            {
                where: { booking_id: booking_id }
            }
        );

        // Update booking status to completed
        await Booked.update(
            { status: "completed" },
            { where: { id: booking_id } }
        );

        return res.status(200).json({
            success: true,
            message: "Ride tracking completed successfully",
            booking_id: booking_id,
            status: "completed"
        });

    } catch (error) {
        console.error("Complete Ride Tracking Error:", error);
        return res.status(500).json({
            success: false,
            message: "Failed to complete ride tracking",
            error: error.message
        });
    }
};

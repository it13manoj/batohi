const Booking = require("../Models/booking");
const Trip = require("../Models/trip");
const vehicleType = require("../Models/vehicle.Type");
const Agent = require("../Models/agent")


exports.create = async (req, res) => {
    try {
        await Booking.create({
            booking_no: req.body.booking_no,
            customer_id: req.body.customer_id,
            agent_id: req.body.agent_id,
            vehicle_id: req.body.vehicle_id,
            driver_id: req.body.driver_id,
            vehicle_type_id: req.body.vehicle_type_id,
            booking_type: req.body.booking_type,
            booking_status: req.body.booking_status,
            payment_status: req.body.payment_status,

            pickup_address: req.body.pickup_address,
            pickup_city: req.body.pickup_city,
            pickup_latitude: req.body.pickup_latitude,
            pickup_longitude: req.body.pickup_longitude,

            drop_address: req.body.drop_address,
            drop_city: req.body.drop_city,
            drop_latitude: req.body.drop_latitude,
            drop_longitude: req.body.drop_longitude,

            pickup_date: req.body.pickup_date,
            pickup_time: req.body.pickup_time,
            return_date: req.body.return_date,
            return_time: req.body.return_time,

            distance_km: req.body.distance_km,
            estimated_duration_minutes: req.body.estimated_duration_minutes,
            passenger_count: req.body.passenger_count,
            luggage_count: req.body.luggage_count,

            base_fare: req.body.base_fare,
            distance_fare: req.body.distance_fare,
            time_fare: req.body.time_fare,
            tax_amount: req.body.tax_amount,
            discount_amount: req.body.discount_amount,
            total_amount: req.body.total_amount,

            special_instructions: req.body.special_instructions,
            cancellation_reason: req.body.cancellation_reason,
            cancelled_at: req.body.cancelled_at
        });

        res.send("Booking created successfully");

    } catch (error) {
        res.status(500).send(error.message);
    }
};


exports.bookride = async (req, res) => {
    try {

        const {
            trip_id,
            customer_id,
            passenger_count
        } = req.body;

        // Check required fields
        if (!trip_id || !customer_id || !passenger_count) {
            return res.status(400).json({
                success: false,
                message: "trip_id, customer_id and passenger_count are required"
            });
        }

        // Find available trip
        const trip = await Trip.findOne({
            where: {
                id: trip_id,
                status: "Available"
            }
        });

        if (!trip) {
            return res.status(404).json({
                success: false,
                message: "Ride is not available"
            });
        }

        // Check seats
        if (trip.available_seats <= 0) {
            return res.status(400).json({
                success: false,
                message: "No seats available"
            });
        }

        if (trip.available_seats < passenger_count) {
            return res.status(400).json({
                success: false,
                message: `Only ${trip.available_seats} seats available`
            });
        }

        // Create booking
        await Booking.create({

            booking_no: "BK-" + Date.now(),

            customer_id: customer_id,

            agent_id: trip.agent_id,
            vehicle_id: trip.vehicle_id,
            driver_id: trip.driver_id,
            trip_id: trip.id,
            vehicle_type_id: trip.vehicle_type_id,

            booking_type: "one_way",
            booking_status: "confirmed",
            payment_status: "pending",

            pickup_address: trip.pickup_address,
            pickup_city: trip.pickup_city,

            pickup_latitude: 0,
            pickup_longitude: 0,

            drop_address: trip.drop_address,
            drop_city: trip.drop_city,

            drop_latitude: 0,
            drop_longitude: 0,

            pickup_date: new Date(),
            pickup_time: "10:00:00",

            return_date: null,
            return_time: null,

            distance_km: 0,
            estimated_duration_minutes: 0,

            passenger_count: passenger_count,
            luggage_count: 0,

            base_fare: 0,
            distance_fare: 0,
            time_fare: 0,
            tax_amount: 0,
            discount_amount: 0,
            total_amount: 0
        });

        // Reduce available seats
        await trip.update({
            available_seats:
                trip.available_seats - passenger_count
        });

        // Only confirmation response
        return res.status(201).json({
            success: true,
            message: "Ride booked successfully",
            booking_status: "confirmed"
        });

    } catch (error) {

        console.log("Book Ride Error:", error);

        return res.status(500).json({
            success: false,
            message: "Something went wrong",
            error: error.message
        });
    }
};

exports.getAllBookedRides = async (req, res) => {
    try {

        const bookings = await Booking.findAll({
            where: {
                booking_status: "confirmed"
            },
            order: [["created_at", "DESC"]]
        });

        return res.status(200).json({
            success: true,
            message: "All booked rides fetched successfully",
            count: bookings.length,
            data: bookings
        });

    } catch (error) {

        console.log("Get Booked Rides Error:", error);

        return res.status(500).json({
            success: false,
            message: "Failed to fetch booked rides",
            error: error.message
        });
    }
};
exports.bookedHistory = async (req, res) => {
    try {

        const { customer_id } = req.params;

        const bookings = await Booking.findAll({
            where: {
                customer_id: customer_id,
                booking_status: "confirmed"
            },
            order: [["created_at", "DESC"]]
        });

        return res.status(200).json({
            success: true,
            message: "Booked ride history fetched successfully",
            count: bookings.length,
            data: bookings
        });

    } catch (error) {

        console.log("Booked History Error:", error);

        return res.status(500).json({
            success: false,
            message: "Failed to fetch booked ride history",
            error: error.message
        });
    };
}
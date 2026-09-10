const Trip = require("../Models/trip");
const Driver = require("../Models/driver");
const Vehicle = require("../Models/vehicle");
const VehicleType = require("../Models/vehicle.Type");
const Agent = require("../Models/agent")


// CREATE TRIP
exports.create = async (req, res) => {
    try {

        const {
            driver_id,
            agent_id,
            vehicle_id,
            vehicle_type_id,
            pickup_address,
            pickup_city,
            drop_address,
            drop_city,
            available_seats,
        } = req.body;

        const trip = await Trip.create({
            driver_id,
            agent_id,
            vehicle_id,
            vehicle_type_id,
            pickup_address,
            pickup_city,
            drop_address,
            drop_city,
            available_seats,
            status: "Available"
        });

        res.status(201).json({
            success: true,
            message: "Trip created successfully",
            data: trip
        });

    } catch (error) {

        res.status(500).json({
            success: false,
            message: "Trip creation failed",
            error: error.message
        });

    }
};

exports.searchRide = async (req, res) => {
    try {

        const {
            pickup_city,
            drop_city,
            vehicle_type_id
        } = req.body;

        const where = {
            status: "Available"
        };

        if (pickup_city) {
            where.pickup_city = pickup_city;
        }

        if (drop_city) {
            where.drop_city = drop_city;
        }

        if (vehicle_type_id) {
            where.vehicle_type_id = vehicle_type_id;
        }

        const trips = await Trip.findAll({
            where: where,

            include: [
                {
                    model: Driver,
                    as: "driver"
                },
                {
                    model: Vehicle,
                    as: "vehicle"
                },
                {
                    model: VehicleType,
                    as: "vehicleType"
                }
            ]
        });

        if (trips.length === 0) {
            return res.status(404).json({
                success: false,
                message: "No available ride found"
            });
        }

        res.status(200).json({
            success: true,
            message: "Available rides fetched successfully",
            data: trips
        });

    } catch (error) {


        res.status(500).json({
            success: false,
            message: "Ride search failed",
            error: error.message
        });

    }
};
exports.listRides = async (req, res) => {
    try {
        const trips = await Trip.findAll({
            where: {
                status: "Available"
            },
            include: [
                {
                    model: Driver,
                    as: "driver"
                },
                {
                    model: Vehicle,
                    as: "vehicle"

                },
                {
                    model: VehicleType,
                    as: "vehicleType"
                }
            ]
        });

        res.status(200).json({
            success: true,
            message: "Available rides fetched successfully",
            data: trips
        });

    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Failed to fetch rides",
            error: error.message
        });
    }
};

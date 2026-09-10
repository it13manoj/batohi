const Vehicle = require("../Models/vehicle");
const VehicleType = require("../Models/vehicle.Type");

exports.create = async (req, res) => {
    try {
        const vehicle = await Vehicle.create({
            vehicle_type_id: req.body.vehicle_type_id,
            registration_no: req.body.registration_no,
            vehicle_name: req.body.vehicle_name,
            manufacturer: req.body.manufacturer,
            model: req.body.model,
            manufacturing_year: req.body.manufacturing_year,
            colour: req.body.colour,
            seating_capacity: req.body.seating_capacity,
            fuel_type: req.body.fuel_type,
            rc_number: req.body.rc_number,
            insurance_no: req.body.insurance_no,
            insurance_expiry_date: req.body.insurance_expiry_date,
            permit_number: req.body.permit_number,
            permit_expiry_date: req.body.permit_expiry_date,
            status: req.body.status
        });

        res.status(201).json({
            message: "Vehicle created successfully",
            data: vehicle
        });

    } catch (error) {
        res.status(500).json({
            message: "Vehicle creation failed",
            error: error.message
        });
    }
};


exports.getByVehicleId = async (req, res) => {
    try {

        const { vehicle_id } = req.body;

        const vehicle = await Vehicle.findOne({
            where: {
                id: vehicle_id
            }
        });

        if (!vehicle) {
            return res.status(404).json({
                message: "Vehicle not found"
            });
        }

        res.status(200).json({
            message: "Vehicle fetched successfully",
            data: vehicle
        });

    } catch (error) {

        res.status(500).json({
            message: "Failed to fetch vehicle",
            error: error.message
        });

    }
};
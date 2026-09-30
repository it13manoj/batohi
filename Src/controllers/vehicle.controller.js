const { Driver } = require("../Models");
const Vehicle = require("../Models/vehicle");
const VehicleType = require("../Models/vehicle.Type");
const sendResponse = require("../Utils/reponse");

exports.create = async (req, res) => {
    try {
        const driver = await Driver.findOne({
            where: { "user_id": req.user.id }
        })
        const vehicle = await Vehicle.create({
            user_id: req.user.id,
            driver_id: req.driver.id,
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


exports.findByDriver = async (req, res) => {
    try {

        const vehicle = await Vehicle.findAll({
            where: {
                user_id: req.user.id
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

exports.updateVehicle = async (req, res) => {
    try {
        const { id } = req.params;
        const vehicle = await Vehicle.findByPk(id);
        if (!vehicle) return errorResponse(res, 404, "Vehicle not found");

        const {
            name,
            vehicleName,
            plateNumber,
            registrationNo,
            seatingCapacity,
            fuel,
            fuelType,
            status,
            driverId,
            manufacturer,
            model,
            manufacturingYear,
            colour,
            color,
            rcNumber,
            insuranceNo,
            insuranceNumber,
            insuranceExpiryDate,
            permitNumber,
            permitExpiryDate,
            vehicleTypeId,
        } = req.body;

        const updateData = {};
        if (name !== undefined || vehicleName !== undefined)
            updateData.vehicle_name = name || vehicleName;
        if (plateNumber !== undefined || registrationNo !== undefined)
            updateData.registration_no = plateNumber || registrationNo;
        if (manufacturer !== undefined) updateData.manufacturer = manufacturer;
        if (model !== undefined) updateData.model = model;
        if (manufacturingYear !== undefined && manufacturingYear !== null)
            updateData.manufacturing_year = Number(manufacturingYear);
        if (colour !== undefined || color !== undefined)
            updateData.colour = colour || color;
        if (seatingCapacity !== undefined && seatingCapacity !== null)
            updateData.seating_capacity = Number(seatingCapacity);
        if (fuel !== undefined || fuelType !== undefined)
            updateData.fuel_type = (fuel || fuelType)?.toLowerCase();
        if (status !== undefined) updateData.status = status;
        if (driverId !== undefined) updateData.driver_id = driverId;
        if (rcNumber !== undefined) updateData.rc_number = rcNumber;
        if (insuranceNo !== undefined || insuranceNumber !== undefined)
            updateData.insurance_no = insuranceNo || insuranceNumber;
        if (insuranceExpiryDate !== undefined)
            updateData.insurance_expiry_date = insuranceExpiryDate;
        if (permitNumber !== undefined) updateData.permit_number = permitNumber;
        if (permitExpiryDate !== undefined)
            updateData.permit_expiry_date = permitExpiryDate;
        if (vehicleTypeId !== undefined) updateData.vehicle_type_id = vehicleTypeId;

        console.log("Update Data Payload:", updateData);

        // Call update directly on the fetched instance
        await Vehicle.update(updateData, {
            where: { id: id }
        });

        return sendResponse(res, 200, "Vehicle updated successfully", vehicle);
    } catch (error) {
        console.error("Update Vehicle Error:", error);
        return sendResponse(res, 500, "Failed to update vehicle", error.message || error);
    }
};
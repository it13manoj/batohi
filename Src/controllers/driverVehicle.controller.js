const driverVehicle = require("../Models/driverVehicle");

exports.create = async (req, res) => {
    try {
        await driverVehicle.create({
            driver_id: req.body.driver_id,
            vehicle_id: req.body.vehicle_id,
            assigned_from: req.body.assigned_from,
            assigned_to: req.body.assigned_to,
            status: req.body.status
        });

        res.send("Driver vehicle assigned  successfully");

    } catch (error) {
        res.status(500).send(error.message);
    }
}
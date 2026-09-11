const vehicleType = require("../Models/vehicle.Type");
const vehicle_types = require("../Models/vehicle.Type");
const sendResponse = require("../Utils/reponse");

exports.create = async (req, res) => {
    try {
        const
            { vehicle_category,
                name,
                description,
                seating_capacity,
                luggage_capacity,
                base_fare,
                per_km_rate,
                per_hour_rate,
                status
            } = req.body;

        await vehicle_types.create({
            user_id: req.user.id,
            vehicle_category,
            name,
            description,
            seating_capacity,
            luggage_capacity,
            base_fare,
            per_km_rate,
            per_hour_rate,
            status
        });


        res.send("vehicleType created successfully");

    } catch (error) {
        res.send(error.message);
    }
};


exports.getType = async (req, res) => {
    try {
        const response = await vehicleType.findAll({
            where: { "user_id": req.user.id }
        })

        return sendResponse(
            res,
            200,
            "Successfully fetch records!",
            response
        );
    } catch {
        return sendResponse(
            res,
            400,
            ""
        )
    }
}
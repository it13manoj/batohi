const vehicle_types = require("../Models/vehicle.Type");

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
const FareRule = require("../Models/fare.rule");

exports.create = async (req, res) => {
    try {
        const {
            vehicle_type_id,
            base_fare,
            per_km_rate,
            per_hour_rate,
            minimum_fare,
            night_charge,
            waiting_charge,
            effective_from,
            effective_to,
            status
        } = req.body;

        const data = await FareRule.create({
            vehicle_type_id,
            base_fare,
            per_km_rate,
            per_hour_rate,
            minimum_fare,
            night_charge,
            waiting_charge,
            effective_from,
            effective_to,
            status
        });

        res.status(201).json({
            message: "Fare rule created successfully",
            data: data
        });

    } catch (error) {
        res.status(500).json({
            message: error.message
        });
    }
};
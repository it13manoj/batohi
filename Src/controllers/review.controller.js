const Review = require("../Models/review");

exports.create = async (req, res) => {
    try {
        const {
            booking_id,
            customer_id,
            driver_id,
            rating,
            review
        } = req.body;

        const data = await Review.create({
            booking_id,
            customer_id,
            driver_id,
            rating,
            review
        });

        res.status(201).json({
            message: "Review created successfully",
            data: data
        });

    } catch (error) {
        res.status(500).json({
            message: error.message
        });
    }
};
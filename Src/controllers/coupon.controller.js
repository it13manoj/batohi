const Coupon = require("../Models/coupon");

exports.create = async (req, res) => {
    try {
        const {
            coupon_code,
            discount_type,
            discount_value,
            minimum_amount,
            maximum_discount,
            valid_from,
            valid_to,
            usage_limit,
            status
        } = req.body;

        const data = await Coupon.create({
            coupon_code,
            discount_type,
            discount_value,
            minimum_amount,
            maximum_discount,
            valid_from,
            valid_to,
            usage_limit,
            status
        });

        res.status(201).json({
            message: "Coupon created successfully",
            data: data
        });

    } catch (error) {
        res.status(500).json({
            message: error.message
        });
    }
};
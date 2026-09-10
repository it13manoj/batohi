const CustomerAddress = require("../Models/customer.address");

exports.create = async (req, res) => {
    try {
        const {
            customer_id,
            address_type,
            address,
            city,
            state,
            pincode,
            latitude,
            longitude,
            is_default
        } = req.body;

        const data = await CustomerAddress.create({
            customer_id,
            address_type,
            address,
            city,
            state,
            pincode,
            latitude,
            longitude,
            is_default
        });

        res.status(201).json({
            message: "Customer address created successfully",
            data: data
        });

    } catch (error) {
        res.status(500).json({
            message: error.message
        });
    }
};
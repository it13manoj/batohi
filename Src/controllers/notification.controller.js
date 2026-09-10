const Notification = require("../Models/notification");

exports.create = async (req, res) => {
    try {
        const {
            user_id,
            title,
            message,
            notification_type,
            is_read
        } = req.body;

        const data = await Notification.create({
            user_id,
            title,
            message,
            notification_type,
            is_read
        });

        res.status(201).json({
            message: "Notification created successfully",
            data: data
        });

    } catch (error) {
        res.status(500).json({
            message: error.message
        });
    }
};
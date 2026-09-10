
const BookingItem = require("../Models/booking.Item");

exports.create = async (req, res) => {
    try {
        await BookingItem.create({
            booking_id: req.body.booking_id,
            status: req.body.status,
            remark: req.body.remark,
            changed_by: req.body.changed_by
        });

        res.send("Booking history created successfully");

    } catch (error) {
        res.status(500).send(error.message);
    }
};
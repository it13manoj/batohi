const Payment = require("../Models/payment");

exports.create = async (req, res) => {
    try {
        await Payment.create({
            booking_id: req.body.booking_id,
            transaction_id: req.body.transaction_id,
            payment_method: req.body.payment_method,
            amount: req.body.amount,
            payment_status: req.body.payment_status,
            paid_at: req.body.paid_at,
            refund_amount: req.body.refund_amount,
            refund_status: req.body.refund_status
        });

        res.send("Payment created successfully");

    } catch (error) {
        res.status(500).send(error.message);
    }
};
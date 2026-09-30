const Payment = require("../Models/payment");
const Booking = require("../Models/booking");
const User = require("../Models/user");
const Customer = require("../Models/customer");

// =========================
// CREATE PAYMENT
// =========================
exports.create = async (req, res) => {
    try {
        const {
            booking_id,
            transaction_id,
            payment_method,
            amount,
            payment_status,
            paid_at,
            refund_amount,
            refund_status
        } = req.body;

        const payment = await Payment.create({
            booking_id,
            transaction_id,
            payment_method,
            amount,
            payment_status,
            paid_at,
            refund_amount: refund_amount || 0,
            refund_status
        });

        return res.status(201).json({
            success: true,
            message: "Payment created successfully",
            data: payment
        });

    } catch (error) {
        console.error("CREATE PAYMENT ERROR:", error);

        return res.status(500).json({
            success: false,
            message: "Failed to create payment",
            error: error.message
        });
    }
};


// =========================
// GET ALL PAYMENTS
// =========================const { QueryTypes } = require("sequelize");


// =====================================================
// GET ALL PAYMENTS
// =====================================================
exports.getPayments = async (req, res) => {
    try {
        const payments = await Payment.findAll({
            order: [["created_at", "DESC"]]
        });

        const data = [];

        for (const payment of payments) {

            // 1. Payment -> Booking
            const booking = await Booking.findByPk(payment.booking_id);

            // 2. Booking -> User
            let user = null;

            if (booking && booking.user_id) {
                user = await User.findByPk(booking.user_id);
            }

            // 3. User -> Customer
            let customer = null;

            if (user) {
                customer = await Customer.findOne({
                    where: {
                        user_id: user.id
                    }
                });
            }

            // 4. Customer name
            let customerName = "Customer";

            if (customer) {
                customerName = [
                    customer.first_name,
                    customer.last_name
                ]
                    .filter(Boolean)
                    .join(" ");

                if (!customerName) {
                    customerName = user?.username || "Customer";
                }
            } else if (user) {
                customerName = user.username || "Customer";
            }

            data.push({
                id: payment.id,

                payment_id: `PAY${10000 + payment.id}`,

                transaction_id: payment.transaction_id,

                booking_id: payment.booking_id,

                booking_no: booking?.booking_no || `BK-${payment.booking_id}`,

                customer_name: customerName,

                customer_email: user?.email || "N/A",

                customer_mobile:
                    customer?.mobile_number ||
                    user?.mobile_no ||
                    "N/A",

                payment_method: payment.payment_method,

                amount: payment.amount,

                payment_status: payment.payment_status,

                paid_at: payment.paid_at,

                refund_amount: payment.refund_amount,

                refund_status: payment.refund_status,

                created_at: payment.created_at,

                updated_at: payment.updated_at
            });
        }

        return res.status(200).json({
            success: true,
            count: data.length,
            data: data
        });

    } catch (error) {

        console.error("GET PAYMENTS ERROR:", error);

        return res.status(500).json({
            success: false,
            message: "Failed to fetch payments",
            error: error.message
        });
    }
};
// =========================
// GET PAYMENT BY ID
// =========================
exports.getPaymentById = async (req, res) => {
    try {

        const { id } = req.params;

        const payment = await Payment.findByPk(id);

        if (!payment) {
            return res.status(404).json({
                success: false,
                message: "Payment not found"
            });
        }

        return res.status(200).json({
            success: true,
            data: payment
        });

    } catch (error) {
        console.error("GET PAYMENT ERROR:", error);

        return res.status(500).json({
            success: false,
            message: "Failed to fetch payment",
            error: error.message
        });
    }
};


// =========================
// PAYMENT DASHBOARD
// =========================
exports.getPaymentStats = async (req, res) => {
    try {

        const payments = await Payment.findAll();

        const totalPayments = payments.length;

        const successfulPayments = payments.filter(
            p => ["success", "successful", "paid"].includes(
                String(p.payment_status).toLowerCase()
            )
        );

        const pendingPayments = payments.filter(
            p => String(p.payment_status).toLowerCase() === "pending"
        );

        const failedPayments = payments.filter(
            p => String(p.payment_status).toLowerCase() === "failed"
        );

        const refundedPayments = payments.filter(
            p => String(p.payment_status).toLowerCase() === "refunded"
        );

        const totalRevenue = successfulPayments.reduce(
            (sum, p) => sum + Number(p.amount || 0),
            0
        );

        const refundedAmount = payments.reduce(
            (sum, p) => sum + Number(p.refund_amount || 0),
            0
        );

        const netRevenue = totalRevenue - refundedAmount;

        // Today's revenue
        const today = new Date();

        const todayRevenue = successfulPayments
            .filter(p => {
                if (!p.paid_at) return false;

                const paidDate = new Date(p.paid_at);

                return (
                    paidDate.getDate() === today.getDate() &&
                    paidDate.getMonth() === today.getMonth() &&
                    paidDate.getFullYear() === today.getFullYear()
                );
            })
            .reduce(
                (sum, p) => sum + Number(p.amount || 0),
                0
            );

        return res.status(200).json({
            success: true,

            data: {
                total_payments: totalPayments,
                successful: successfulPayments.length,
                pending: pendingPayments.length,
                failed: failedPayments.length,
                refunded: refundedPayments.length,

                total_revenue: totalRevenue,
                today_revenue: todayRevenue,
                refunded_amount: refundedAmount,
                net_revenue: netRevenue
            }
        });

    } catch (error) {
        console.error("PAYMENT STATS ERROR:", error);

        return res.status(500).json({
            success: false,
            message: "Failed to fetch payment statistics",
            error: error.message
        });
    }
};
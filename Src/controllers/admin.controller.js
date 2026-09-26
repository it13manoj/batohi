const Admin = require("../Models/admin");
const { Op, fn, col, literal } = require("sequelize");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const user = require("../Models/user")


const {
    User,
    Driver,
    Customer,
    Vehicle,
    Booking
} = require("../Models");
 

exports.create = async (req, res) => {
    try {
        const {
            user_id,
            admin_name,
            role,
            status
        } = req.body;

        await Admin.create({
            user_id: user_id,
            admin_name: admin_name,
            role: role,
            status: status
        });

        res.send("Admin created successfully");

    } catch (error) {
        res.send(error.message);
    }
};



exports.login = async (req, res) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({
                success: false,
                message: "Email and password are required"
            });
        }

        // ADMIN user find
        const user = await User.findOne({
            where: {
                email: email,
                user_type: "ADMIN",
                is_deleted: false,
                is_blocked: false,
                status: true
            }
        });

        if (!user) {
            return res.status(403).json({
                success: false,
                message: "You are not authorized as admin"
            });
        }

        // Password verify
        const isPasswordValid = await bcrypt.compare(
            password,
            user.password_hash
        );

        if (!isPasswordValid) {
            return res.status(401).json({
                success: false,
                message: "Invalid email or password"
            });
        }

        // JWT token
        const token = jwt.sign(
            {
                id: user.id,
                email: user.email,
                user_type: user.user_type
            },
            process.env.JWT_SECRET,
            {
                expiresIn: "7d"
            }
        );

        return res.status(200).json({
            success: true,
            message: "Admin login successful",
            token,
            admin: {
                id: user.id,
                username: user.username,
                email: user.email,
                user_type: user.user_type,
                status: user.status
            }
        });

    } catch (error) {
        console.error("ADMIN LOGIN ERROR:", error);

        return res.status(500).json({
            success: false,
            message: "Internal server error",
            error: error.message
        });
    }
};


// ======================================================
// ADMIN DASHBOARD
// ======================================================
exports.dashboard = async (req, res) => {
    try {

        // ==================================================
        // 1. TOTAL USERS
        // ==================================================
        // ADMIN ko count nahi karenge
        // USERS type ko actual customers/users maan rahe hain

        const totalUsers = await User.count({
            where: {
                user_type: "USERS",
                is_deleted: false
            }
        });


        // ==================================================
        // 2. BLOCKED USERS
        // ==================================================

        const blockedUsers = await User.count({
            where: {
                user_type: "USERS",
                is_deleted: false,
                is_blocked: true
            }
        });


        // 3. TOTAL DRIVERS
        // ==================================================

        const totalDrivers = await Driver.count();


        // ==================================================
        // 4. BLOCKED DRIVERS
        // ==================================================
        // Driver ka user_id -> users.id

        const blockedDrivers = await Driver.count({
            include: [
                {
                    model: User,
                    as: "user",
                    where: {
                        is_blocked: true
                    },
                    required: true
                }
            ]
        });


        // ==================================================
        // 5. TOTAL VEHICLES
        // ==================================================

        const totalVehicles = await Vehicle.count();


        // ==================================================
        // 6. TOTAL BOOKINGS
        // ==================================================

        const totalBookings = await Booking.count();


        // ==================================================
        // 7. GET ALL BOOKINGS
        // ==================================================
        // Status aur revenue ko safely calculate karne ke liye

        const allBookings = await Booking.findAll({
            attributes: [
                "id",
                "booking_no",
                "booking_status",
                "payment_status",
                "total_amount",
                "created_at"
            ],
            raw: true
        });

        // ==================================================
        // BOOKING STATUS COUNT
        // ==================================================

        let completed = 0;
        let pending = 0;
        let active = 0;
        let cancelled = 0;
        let rejected = 0;
        let inProgress = 0;


        allBookings.forEach((booking) => {

            const status = String(
                booking.booking_status || ""
            ).toLowerCase().trim();


            // Completed
            if (
                status === "completed" ||
                status === "complete"
            ) {
                completed++;
            }


            // Pending
            else if (
                status === "pending"
            ) {
                pending++;
            }


            // Active / Confirmed
            else if (
                status === "active" ||
                status === "confirmed" ||
                status === "accepted"
            ) {
                active++;
            }


            // In Progress
            else if (
                status === "in progress" ||
                status === "in_progress" ||
                status === "on ride" ||
                status === "on_ride" ||
                status === "started"
            ) {
                inProgress++;
            }


            // Cancelled
            else if (
                status === "cancelled" ||
                status === "canceled"
            ) {
                cancelled++;
            }


            // Rejected
            else if (
                status === "rejected" ||
                status === "reject"
            ) {
                rejected++;
            }

        });


        // ==================================================
        // 8. TOTAL REVENUE
        // ==================================================

        let totalRevenue = 0;


        allBookings.forEach((booking) => {

            const paymentStatus = String(
                booking.payment_status || ""
            ).toLowerCase().trim();


            // Sirf successful/paid payment ko revenue me lenge
            if (
                paymentStatus === "paid" ||
                paymentStatus === "completed" ||
                paymentStatus === "success" ||
                paymentStatus === "successful"
            ) {

                totalRevenue += Number(
                    booking.total_amount || 0
                );

            }

        });


        // ==================================================
        // 9. BOOKING PERCENTAGE
        // ==================================================

        const getPercentage = (count) => {

            if (totalBookings === 0) {
                return 0;
            }

            return Number(
                ((count / totalBookings) * 100).toFixed(2)
            );
        };


        // ==================================================
        // 10. LAST 6 MONTH REVENUE
        // ==================================================

        const now = new Date();

        const revenueOverview = [];


        for (let i = 5; i >= 0; i--) {

            const date = new Date(
                now.getFullYear(),
                now.getMonth() - i,
                1
            );


            const year = date.getFullYear();
            const month = date.getMonth();


            let revenue = 0;


            allBookings.forEach((booking) => {

                if (!booking.created_at) {
                    return;
                }


                const bookingDate = new Date(
                    booking.created_at
                );


                const paymentStatus = String(
                    booking.payment_status || ""
                ).toLowerCase().trim();


                const isPaid =
                    paymentStatus === "paid" ||
                    paymentStatus === "completed" ||
                    paymentStatus === "success" ||
                    paymentStatus === "successful";


                if (
                    bookingDate.getFullYear() === year &&
                    bookingDate.getMonth() === month &&
                    isPaid
                ) {

                    revenue += Number(
                        booking.total_amount || 0
                    );

                }

            });


            revenueOverview.push({

                month: date.toLocaleString("en-US", {
                    month: "short"
                }),

                year: year,

                revenue: Number(
                    revenue.toFixed(2)
                )

            });

        }
        // ==================================================
        // 11. RECENT BOOKINGS
        // ==================================================

        const recentBookings = await Booking.findAll({

            attributes: [
                "id",
                "booking_no",
                "customer_id",
                "vehicle_id",
                "driver_id",
                "booking_status",
                "payment_status",
                "total_amount",
                "pickup_date",
                "pickup_time",
                "created_at"
            ],

            include: [

                {
                    model: Customer,
                    as: "customer",

                    attributes: [
                        "id",
                        "user_id",
                        "first_name",
                        "last_name",
                        "mobile_number",
                        "status"
                    ]
                },

                {
                    model: Vehicle,
                    as: "vehicle",

                    attributes: [
                        "id",
                        "driver_id",
                        "vehicle_name",
                        "registration_no",
                        "manufacturer",
                        "model",
                        "status"
                    ]
                }

            ],

            order: [
                ["created_at", "DESC"]
            ],

            limit: 5

        });


        // ==================================================
        // 12. FINAL RESPONSE
        // ==================================================

        return res.status(200).json({

            success: true,

            message: "Admin dashboard fetched successfully",

            dashboard: {

                // ==========================================
                // TOP CARDS
                // ==========================================

                total_users: totalUsers,

                total_drivers: totalDrivers,

                total_vehicles: totalVehicles,

                total_bookings: totalBookings,

                total_revenue: Number(
                    totalRevenue.toFixed(2)
                ),


                // ==========================================
                // BLOCKED
                // ==========================================

                blocked_users: blockedUsers,

                blocked_drivers: blockedDrivers,


                // ==========================================
                // BOOKING SUMMARY
                // ==========================================

                booking_summary: {

                    completed: {
                        count: completed,
                        percentage: getPercentage(completed)
                    },

                    pending: {
                        count: pending,
                        percentage: getPercentage(pending)
                    },

                    active: {
                        count: active,
                        percentage: getPercentage(active)
                    },

                    in_progress: {
                        count: inProgress,
                        percentage: getPercentage(inProgress)
                    },

                    cancelled: {
                        count: cancelled,
                        percentage: getPercentage(cancelled)
                    },

                    rejected: {
                        count: rejected,
                        percentage: getPercentage(rejected)
                    }

                },


                // ==========================================
                // REVENUE GRAPH
                // ==========================================

                revenue_overview: revenueOverview,


                // ==========================================
                // RECENT BOOKINGS
                // ==========================================

                recent_bookings: recentBookings

            }

        });

    } catch (error) {

        console.error(
            "ADMIN DASHBOARD ERROR:",
            error
        );

        return res.status(500).json({

            success: false,

            message: "Failed to fetch admin dashboard",

            error: error.message

        });

    }
};









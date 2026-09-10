const { DataTypes } = require("sequelize");
const sequelize = require("../config/database");

const Booking = sequelize.define("Booking", {
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true
    },

    booking_no: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true
    },

    customer_id: {
        type: DataTypes.INTEGER,
        allowNull: false
    },

    agent_id: {
        type: DataTypes.INTEGER,
        allowNull: false
    },

    vehicle_id: {
        type: DataTypes.INTEGER,
        allowNull: false
    },

    driver_id: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
trip_id: {
    type: DataTypes.INTEGER,
    allowNull: false
},
    vehicle_type_id: {
        type: DataTypes.INTEGER,
        allowNull: false
    },

    booking_type: {
        type: DataTypes.STRING,
        allowNull: false
    },

    booking_status: {
        type: DataTypes.STRING,
        allowNull: true
    },

    payment_status: {
        type: DataTypes.STRING,
        allowNull: false
    },

    pickup_address: {
        type: DataTypes.TEXT,
        allowNull: false
    },

    pickup_city: {
        type: DataTypes.STRING,
        allowNull: false
    },

    pickup_latitude: {
        type: DataTypes.DECIMAL(10, 8),
        allowNull: true
    },

    pickup_longitude: {
        type: DataTypes.DECIMAL(11, 8),
        allowNull: false
    },

    drop_address: {
        type: DataTypes.TEXT,
        allowNull: false
    },

    drop_city: {
        type: DataTypes.STRING,
        allowNull: false
    },

    drop_latitude: {
        type: DataTypes.DECIMAL(10, 8),
        allowNull: false
    },

    drop_longitude: {
        type: DataTypes.DECIMAL(11, 8),
        allowNull: false
    },

    pickup_date: {
        type: DataTypes.DATEONLY,
        allowNull: false
    },

    pickup_time: {
        type: DataTypes.TIME,
        allowNull: false
    },

    return_date: {
        type: DataTypes.DATEONLY,
        allowNull: true
    },

    return_time: {
        type: DataTypes.TIME,
        allowNull: true
    },

    distance_km: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: false
    },

    estimated_duration_minutes: {
        type: DataTypes.INTEGER,
        allowNull: false
    },

    passenger_count: {
        type: DataTypes.INTEGER,
        allowNull: false
    },

    luggage_count: {
        type: DataTypes.INTEGER,
        allowNull: false
    },

    base_fare: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: false
    },

    distance_fare: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: false
    },

    time_fare: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: false
    },

    tax_amount: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: false
    },

    discount_amount: {
        type: DataTypes.DECIMAL(10, 2),
        defaultValue: 0
    },

    total_amount: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: false
    },

    special_instructions: {
        type: DataTypes.TEXT,
        allowNull: true
    },

    cancellation_reason: {
        type: DataTypes.TEXT,
        allowNull: true
    },

    cancelled_at: {
        type: DataTypes.DATE,
        allowNull: true
    },

    created_at: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW
    },

    updated_at: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW
    }

}, {
    tableName: "bookings",
    timestamps: true,
    createdAt: "created_at",
    updatedAt: "updated_at"
});

module.exports = Booking;

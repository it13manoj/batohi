const { DataTypes } = require("sequelize");
const sequelize = require("../config/database");

const LiveTracking = sequelize.define(
    "LiveTracking",
    {
        id: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true
        },
        booking_id: {
            type: DataTypes.INTEGER,
            allowNull: false,
            comment: "Reference to the booking/booked ride"
        },
        driver_id: {
            type: DataTypes.INTEGER,
            allowNull: false,
            comment: "Driver user ID providing live updates"
        },
        user_id: {
            type: DataTypes.INTEGER,
            allowNull: false,
            comment: "Rider user ID being tracked after pickup"
        },
        current_latitude: {
            type: DataTypes.DECIMAL(10, 8),
            allowNull: false,
            comment: "Current latitude coordinate of the vehicle"
        },
        current_longitude: {
            type: DataTypes.DECIMAL(11, 8),
            allowNull: false,
            comment: "Current longitude coordinate of the vehicle"
        },
        heading: {
            type: DataTypes.DECIMAL(5, 2),
            allowNull: true,
            comment: "Heading / bearing in degrees (0 - 360)"
        },
        speed: {
            type: DataTypes.DECIMAL(6, 2),
            allowNull: true,
            comment: "Current speed in km/h"
        },
        accuracy: {
            type: DataTypes.DECIMAL(6, 2),
            allowNull: true,
            comment: "GPS accuracy in meters"
        },
        altitude: {
            type: DataTypes.DECIMAL(8, 2),
            allowNull: true,
            comment: "Altitude in meters"
        },
        distance_remaining_km: {
            type: DataTypes.DECIMAL(8, 2),
            allowNull: true,
            comment: "Remaining distance to destination in km"
        },
        estimated_arrival_minutes: {
            type: DataTypes.INTEGER,
            allowNull: true,
            comment: "Estimated arrival time in minutes"
        },
        pickup_status: {
            type: DataTypes.ENUM(
                "driver_assigned",
                "arrived_pickup",
                "pickup_confirmed",
                "in_transit",
                "arrived_destination",
                "completed",
                "cancelled"
            ),
            defaultValue: "pickup_confirmed",
            allowNull: false
        },
        is_active: {
            type: DataTypes.BOOLEAN,
            defaultValue: true,
            allowNull: false
        },
        battery_percentage: {
            type: DataTypes.INTEGER,
            allowNull: true,
            comment: "Driver device battery level"
        },
        recorded_at: {
            type: DataTypes.DATE,
            defaultValue: DataTypes.NOW,
            allowNull: false
        }
    },
    {
        tableName: "live_trackings",
        timestamps: true,
        createdAt: "created_at",
        updatedAt: "updated_at",
        indexes: [
            {
                fields: ["booking_id"]
            },
            {
                fields: ["driver_id"]
            },
            {
                fields: ["user_id"]
            },
            {
                fields: ["recorded_at"]
            }
        ]
    }
);

module.exports = LiveTracking;

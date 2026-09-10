const { DataTypes } = require("sequelize");
const sequelize = require("../config/database");

const Trip = sequelize.define(
    "Trip",
    {
        id: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true
        },

        driver_id: {
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

        vehicle_type_id: {
            type: DataTypes.INTEGER,
            allowNull: false
        },

        pickup_address: {
            type: DataTypes.STRING,
            allowNull: false
        },

        pickup_city: {
            type: DataTypes.STRING,
            allowNull: false
        },

        drop_address: {
            type: DataTypes.STRING,
            allowNull: false
        },

        drop_city: {
            type: DataTypes.STRING,
            allowNull: false
        },

        status: {
            type: DataTypes.ENUM(
                "Available",
                "Booked",
                "On Ride",
                "Completed",
                "Cancelled"
            ),
            allowNull: false,
            defaultValue: "Available"
        },

        available_seats: {
            type: DataTypes.INTEGER,
            allowNull: false
        },

        created_at: {
            type: DataTypes.DATE,
            defaultValue: DataTypes.NOW
        },

        updated_at: {
            type: DataTypes.DATE,
            defaultValue: DataTypes.NOW
        }
    },
    {
        tableName: "trips",
        timestamps: true,
        createdAt: "created_at",
        updatedAt: "updated_at"
    }
);

module.exports = Trip;
const { DataTypes } = require("sequelize");
const sequelize = require("../config/database");
const User = require("./user");
const Vehicle = require("./vehicle");
const vehicleType = require("./vehicle.Type");


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
            allowNull: false,
            references: {
                model: User,
                key: "id"
            }
        },

        agent_id: {
            type: DataTypes.INTEGER,
            allowNull: false,
            references: {
                model: User,
                key: "id"
            }
        },


          vehicle_id: {
                type: DataTypes.INTEGER,
                allowNull: false,
                references: {
                    model: Vehicle,
                    key: "id"
                }
            },


          vehicle_type_id: {
                type: DataTypes.INTEGER,
                allowNull: false,
                references: {
                    model: vehicleType,
                    key: "id"
                }
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
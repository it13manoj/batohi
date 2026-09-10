const { DataTypes } = require("sequelize");
const sequelize = require("../config/database")

const DriverVehicle= sequelize.define("DriverVehicle", {
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true
    },

    driver_id: {
        type: DataTypes.INTEGER,
        allowNull: false
    },

    vehicle_id: {
        type: DataTypes.INTEGER,
        allowNull: false
    },

    assigned_from: {
        type: DataTypes.DATE,
        allowNull: false
    },

    assigned_to: {
        type: DataTypes.DATE,
        allowNull: true
    },
      status: {
    type: DataTypes.ENUM(
        "Available",
        "Assigned",
        "On Ride",
        "Inactive"
    ),
    allowNull: false,
    defaultValue: "Available"
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
    tableName: "driver_vehicles",
    timestamps: true,
    createdAt: "created_at",
    updatedAt: "updated_at"
});

module.exports = DriverVehicle;
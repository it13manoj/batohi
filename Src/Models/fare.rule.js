const { DataTypes } = require("sequelize");
const sequelize = require("../config/database");

const FareRule = sequelize.define("FareRule", {
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true
    },

    vehicle_type_id: {
        type: DataTypes.INTEGER,
        allowNull: false
    },

    base_fare: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: false
    },

    per_km_rate: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: false
    },

    per_hour_rate: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: false
    },

    minimum_fare: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: false
    },

    night_charge: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: false
    },

    waiting_charge: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: false
    },

    effective_from: {
        type: DataTypes.DATE,
        allowNull: false
    },

    effective_to: {
        type: DataTypes.DATE,
        allowNull: true
    },

    status: {
        type: DataTypes.STRING,
        allowNull: false,
        defaultValue: "active"
    }

}, {
    tableName: "fare_rules",
    timestamps: true,
    createdAt: "created_at",
    updatedAt: "updated_at"
});

module.exports = FareRule;
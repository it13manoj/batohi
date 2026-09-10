const { DataTypes } = require("sequelize");
const sequelize = require("../config/database");

const Vehicle = sequelize.define("Vehicle", {
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true
    },

vehicle_type_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
        model: "vehicle_types",
        key: "id"
    }
    },

    registration_no: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true
    },

    vehicle_name: {
        type: DataTypes.STRING,
        allowNull: false
    },

    manufacturer: {
        type: DataTypes.STRING,
    },

    model: {
        type: DataTypes.STRING,
    },

    manufacturing_year: {
        type: DataTypes.INTEGER,
    },

    colour: {
        type: DataTypes.STRING,
        allowNull: false
    },

    seating_capacity: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    fuel_type: {
        type: DataTypes.ENUM("petrol", "diesel", "cng", "electric"),
        allowNull: false
    },

    rc_number: {
        type: DataTypes.STRING,
        allowNull: false
    },

    insurance_no: {
        type: DataTypes.STRING,
        allowNull: false
    },

    insurance_expiry_date: {
        type: DataTypes.DATE,
        allowNull: false
    },

    permit_number: {
        type: DataTypes.STRING,
        allowNull: false
    },

    permit_expiry_date: {
        type: DataTypes.DATE,
        allowNull: false
    },

    status: {
        type: DataTypes.STRING,
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
}, {
    tableName: "vehicles",
    timestamps: true,
    createdAt: "created_at",
    updatedAt: "updated_at"
});

module.exports = Vehicle;

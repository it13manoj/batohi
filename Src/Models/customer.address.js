const { DataTypes } = require("sequelize");
const sequelize = require("../config/database");

const CustomerAddress = sequelize.define("CustomerAddress", {
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true
    },

    customer_id: {
        type: DataTypes.INTEGER,
        allowNull: false
    },

    address_type: {
        type: DataTypes.STRING,
        allowNull: false
    },

    address: {
        type: DataTypes.TEXT,
        allowNull: false
    },

    city: {
        type: DataTypes.STRING,
        allowNull: false
    },

    state: {
        type: DataTypes.STRING,
        allowNull: false
    },

    pincode: {
        type: DataTypes.STRING,
        allowNull: false
    },

    latitude: {
        type: DataTypes.DECIMAL(10, 7),
        allowNull: false
    },

    longitude: {
        type: DataTypes.DECIMAL(10, 7),
        allowNull: false
    },

    is_default: {
        type: DataTypes.BOOLEAN,
        defaultValue: false
    }

}, {
    tableName: "customer_address",
    timestamps: true,
    createdAt: "created_at",
    updatedAt: "updated_at"
});

module.exports = CustomerAddress;
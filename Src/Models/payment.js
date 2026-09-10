const { DataTypes } = require("sequelize");
const sequelize = require("../config/database");

const Payment = sequelize.define("Payment", {
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true
    },

    booking_id: {
        type: DataTypes.INTEGER,
        allowNull: false
    },

    transaction_id: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true
    },

    payment_method: {
        type: DataTypes.STRING,
        allowNull: false
    },

    amount: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: false
    },

    payment_status: {
        type: DataTypes.STRING,
        allowNull: false
    },

    paid_at: {
        type: DataTypes.DATE,
        allowNull: true
    },

    refund_amount: {
        type: DataTypes.DECIMAL(10, 2),
        defaultValue: 0
    },

    refund_status: {
        type: DataTypes.STRING,
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
    tableName: "payments",
    timestamps: true,
    createdAt: "created_at",
    updatedAt: "updated_at"
});

module.exports = Payment;
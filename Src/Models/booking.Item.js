const { DataTypes } = require("sequelize");
const sequelize = require("../config/database");

const BookingItem = sequelize.define("BookingItem", {
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true
    },

    booking_id: {
        type: DataTypes.INTEGER,
        allowNull: false
    },

    status: {
        type: DataTypes.STRING,
        allowNull: false
    },

    remark: {
        type: DataTypes.TEXT,
        allowNull: true
    },

    changed_by: {
        type: DataTypes.INTEGER,
        allowNull: true
    },

    created_at: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW
    }
}, {
    tableName: "booking_history",
    timestamps: false
});

module.exports = BookingItem;
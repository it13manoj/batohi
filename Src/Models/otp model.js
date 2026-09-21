const { DataTypes } = require("sequelize");
const sequelize = require("../config/database");

const Otp = sequelize.define("Otp", {
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true
    },

    booked_id: {
        type: DataTypes.INTEGER,
        allowNull: true
    },

    otp: {
        type: DataTypes.INTEGER,
        allowNull: true
    },

    votp: {
        type: DataTypes.INTEGER,
        allowNull: true
    },

    user_id: {
        type: DataTypes.INTEGER,
        allowNull: true
    }

}, {
    tableName: "otps",
    timestamps: true,
    createdAt: "created_at",
    updatedAt: "updated_at"
});

module.exports = Otp;
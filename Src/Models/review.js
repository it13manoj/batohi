const { DataTypes } = require("sequelize");
const sequelize = require("../config/database");

const Review = sequelize.define("Review", {
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true
    },

    booking_id: {
        type: DataTypes.INTEGER,
        allowNull: false
    },

    customer_id: {
        type: DataTypes.INTEGER,
        allowNull: false
    },

    driver_id: {
        type: DataTypes.INTEGER,
        allowNull: false
    },

    rating: {
        type: DataTypes.INTEGER,
        allowNull: false
    },

    review: {
        type: DataTypes.TEXT,
        allowNull: true
    }

}, {
    tableName: "reviews",
    timestamps: true,
    createdAt: "created_at",
    updatedAt: "updated_at"
});

module.exports = Review;
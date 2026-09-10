const { DataTypes } = require("sequelize");
const sequelize = require("../config/database");

const Coupon = sequelize.define("Coupon", {
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true
    },

    coupon_code: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true
    },

    discount_type: {
        type: DataTypes.STRING,
        allowNull: false
    },

    discount_value: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: false
    },

    minimum_amount: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: false
    },

    maximum_discount: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: true
    },

    valid_from: {
        type: DataTypes.DATE,
        allowNull: false
    },

    valid_to: {
        type: DataTypes.DATE,
        allowNull: false
    },

    usage_limit: {
        type: DataTypes.INTEGER,
        allowNull: true
    },

    status: {
        type: DataTypes.STRING,
        allowNull: false,
        defaultValue: "active"
    }

}, {
    tableName: "coupons",
    timestamps: true,
    createdAt: "created_at",
    updatedAt: "updated_at"
});

module.exports = Coupon;
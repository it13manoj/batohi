const { DataTypes } = require("sequelize");
const sequelize = require("../config/database");
const User = require("./user");

const Customer = sequelize.define(
    "Customer",
    {
        id: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true
        },

        user_id: {
            type: DataTypes.INTEGER,
            allowNull: false,
            unique: true,
            references: {
                model: User,
                key: "id"
            }
        },

        first_name: {
            type: DataTypes.STRING(100),
            allowNull: false
        },

        last_name: {
            type: DataTypes.STRING(100),
            allowNull: true
        },

        gender: {
            type: DataTypes.ENUM(
                "male",
                "female",
                "other"
            ),
            allowNull: false
        },

        date_of_birth: {
            type: DataTypes.DATEONLY,
            allowNull: true
        },

        profile_image: {
            type: DataTypes.STRING,
            allowNull: true
        },

        mobile_number: {
            type: DataTypes.STRING(15),
            allowNull: true
        },

        alternate_mobile: {
            type: DataTypes.STRING(15),
            allowNull: true
        },

        address: {
            type: DataTypes.TEXT,
            allowNull: true
        },

        city: {
            type: DataTypes.STRING(100),
            allowNull: true
        },

        state: {
            type: DataTypes.STRING(100),
            allowNull: true
        },

        country: {
            type: DataTypes.STRING(100),
            defaultValue: "India"
        },

        pincode: {
            type: DataTypes.STRING(10),
            allowNull: true
        },

        emergency_contact_name: {
            type: DataTypes.STRING(100),
            allowNull: true
        },

        emergency_contact_number: {
            type: DataTypes.STRING(15),
            allowNull: true
        },

        preferred_language: {
            type: DataTypes.STRING(50),
            defaultValue: "English"
        },

        status: {
            type: DataTypes.ENUM(
                "active",
                "inactive",
                "blocked"
            ),
            defaultValue: "active"
        }
    },
    {
        tableName: "customers",

        // Sequelize automatically handles these
        timestamps: true,
        createdAt: "created_at",
        updatedAt: "updated_at"
    }
);

module.exports = Customer;
const { DataTypes } = require("sequelize");
const sequelize = require("../config/database");

const User = require("./user");

const Agent = sequelize.define(
    "Agent",
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

        agent_code: {
            type: DataTypes.STRING(50),
            allowNull: false,
            unique: true
        },

        agency_name: {
            type: DataTypes.STRING(150),
            allowNull: false
        },

        contact_person: {
            type: DataTypes.STRING(100),
            allowNull: false
        },

        mobile_no: {
            type: DataTypes.STRING(15),
            allowNull: false
        },

        alternate_mobile: {
            type: DataTypes.STRING(15),
            allowNull: true
        },

        email: {
            type: DataTypes.STRING(150),
            allowNull: false,
            unique: true,
            validate: {
                isEmail: true
            }
        },

        agency_logo: {
            type: DataTypes.STRING,
            allowNull: true
        },

        address: {
            type: DataTypes.TEXT,
            allowNull: false
        },

        city: {
            type: DataTypes.STRING(100),
            allowNull: false
        },

        state: {
            type: DataTypes.STRING(100),
            allowNull: false
        },

        country: {
            type: DataTypes.STRING(100),
            allowNull: false,
            defaultValue: "India"
        },

        pincode: {
            type: DataTypes.STRING(10),
            allowNull: false
        },

        /* Business Information */

        business_type: {
            type: DataTypes.ENUM(
                "travel_agency",
                "tour_operator",
                "corporate",
                "individual"
            ),
            allowNull: false
        },

        gst_number: {
            type: DataTypes.STRING(20),
            allowNull: true,
            unique: true
        },

        pan_number: {
            type: DataTypes.STRING(20),
            allowNull: true,
            unique: true
        },

        registration_number: {
            type: DataTypes.STRING(50),
            allowNull: true,
            unique: true
        },

        /* Commission */

        commission_percentage: {
            type: DataTypes.DECIMAL(5, 2),
            allowNull: false,
            defaultValue: 0.00
        },

        /* Bank Details */

        bank_name: {
            type: DataTypes.STRING(100),
            allowNull: true
        },

        account_holder_name: {
            type: DataTypes.STRING(100),
            allowNull: true
        },

        account_number: {
            type: DataTypes.STRING(50),
            allowNull: true
        },

        ifsc_code: {
            type: DataTypes.STRING(20),
            allowNull: true
        },

        /* Status */

        status: {
            type: DataTypes.ENUM(
                "active",
                "inactive",
                "suspended",
                "blocked"
            ),
            defaultValue: "active"
        },

        verification_status: {
            type: DataTypes.ENUM(
                "pending",
                "verified",
                "rejected"
            ),
            defaultValue: "pending"
        }
    },
    {
        tableName: "agents",

        timestamps: true,
        createdAt: "created_at",
        updatedAt: "updated_at"
    }
);

module.exports = Agent;
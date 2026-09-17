const { DataTypes } = require("sequelize");
const sequelize = require("../config/database");

const User = require("./user");

const Driver = sequelize.define(
    "Driver",
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

        driver_code: {
            type: DataTypes.STRING(50),
            allowNull: false,
            unique: true
        },

        first_name: {
            type: DataTypes.STRING(100),
            allowNull: false
        },

        last_name: {
            type: DataTypes.STRING(100),
            allowNull: false
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
            allowNull: false
        },

        profile_image: {
            type: DataTypes.STRING,
            allowNull: false
        },

        mobile_number: {
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

        /* Driving Information */

        driving_license_no: {
            type: DataTypes.STRING(50),
            allowNull: false,
            unique: true
        },

        license_issue_date: {
            type: DataTypes.DATEONLY,
            allowNull: false
        },

        license_expiry_date: {
            type: DataTypes.DATEONLY,
            allowNull: false
        },

        license_image: {
            type: DataTypes.STRING,
            allowNull: false
        },

        experience_years: {
            type: DataTypes.INTEGER,
            allowNull: false
        },

        /* Driver Documents */

        aadhaar_number: {
            type: DataTypes.STRING(20),
            allowNull: false,
            unique: true
        },

        aadhaar_image: {
            type: DataTypes.STRING,
            allowNull: false
        },

        pan_number: {
            type: DataTypes.STRING(20),
            allowNull: true,
            unique: true
        },

        pan_image: {
            type: DataTypes.STRING,
            allowNull: true
        },

        /* Emergency Contact */

        emergency_contact_name: {
            type: DataTypes.STRING(100),
            allowNull: false
        },

        emergency_contact_number: {
            type: DataTypes.STRING(15),
            allowNull: false
        },

        /* Driver Status */

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
        },
        vehicleCategory: {
            type: DataTypes.ENUM('bike', 'auto', 'cab'),
            defaultValue: 'bike',
            field: 'vehicle_category',
        },
        isVerified: {
            type: DataTypes.BOOLEAN,
            defaultValue: false,
            field: 'is_verified',
        },
        isProfileCompleted: {
            type: DataTypes.BOOLEAN,
            defaultValue: false,
            field: 'is_profile_completed',
        },

        /* Availability */

        availability_status: {
            type: DataTypes.ENUM(
                "available",
                "busy",
                "offline"
            ),
            defaultValue: "offline"
        },

        /* Rating */

        rating: {
            type: DataTypes.DECIMAL(3, 2),
            defaultValue: 0.00
        },

        total_rides: {
            type: DataTypes.INTEGER,
            defaultValue: 0
        }
    },
    {
        tableName: "drivers",

        timestamps: true,
        createdAt: "created_at",
        updatedAt: "updated_at"
    }
);

module.exports = Driver;

const { DataTypes } = require("sequelize");
const sequelize = require("../config/database");
const Role = require("./role");

const User = sequelize.define(
    "User",
    {
        id: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true
        },

        username: {
            type: DataTypes.STRING,
            allowNull: false
        },

        email: {
            type: DataTypes.STRING,
            allowNull: false,
            unique: true
        },

        mobile_no: {
            type: DataTypes.STRING,
            allowNull: false
        },

        password_hash: {
            type: DataTypes.STRING,
            allowNull: false
        },

        user_type: {
            type: DataTypes.ENUM("ADMIN", "USERS", "DRIVER", "AGENT"),
            defaultValue: "USERS",
            allowNull: false
        },
        status: {
            type: DataTypes.BOOLEAN,
            defaultValue: true,
            allowNull: true
        },
        is_deleted: {
            type: DataTypes.BOOLEAN,
            defaultValue: false
        },
        is_blocked: {
            type: DataTypes.BOOLEAN,
            defaultValue: false
        },

        role_id: {
            type: DataTypes.INTEGER,
            allowNull: false,
            references: {
                model: Role,
                key: "id"
            },
            defaultValue: 1
        },
        is_verified: {
            type: DataTypes.BOOLEAN,
            defaultValue: false
        },
        latitude: {
            type: DataTypes.DECIMAL(10, 8),
            allowNull: true
        },
        longitude: {
            type: DataTypes.DECIMAL(11, 8),
            allowNull: true
        },
        last_located_at: {
            type: DataTypes.DATE,
            allowNull: true
        },

        last_login_at: {
            type: DataTypes.DATE,
            allowNull: true
        },
        device_token:{
             type: DataTypes.TEXT,
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
    },
    {
        tableName: "users",
        timestamps: false
    }
);

module.exports = User;
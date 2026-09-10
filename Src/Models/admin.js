const { DataTypes } = require("sequelize");
const sequelize = require("../config/database");

const Admin = sequelize.define(
    "Admin",
    {
        id: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true
        },

        user_id: {
            type: DataTypes.INTEGER,
            allowNull: false
        },

        admin_name: {
            type: DataTypes.STRING,
            allowNull: false
        },

        role: {
            type: DataTypes.STRING,
            allowNull: false
        },

        status: {
            type: DataTypes.STRING,
            allowNull: false
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
        tableName: "admins",
        timestamps: false
    }
);

module.exports = Admin;
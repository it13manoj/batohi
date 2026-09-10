const { DataTypes } = require("sequelize");
const sequelize = require("../config/database");

const Notification = sequelize.define("Notification", {
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true
    },

    user_id: {
        type: DataTypes.INTEGER,
        allowNull: false
    },

    title: {
        type: DataTypes.STRING,
        allowNull: false
    },

    message: {
        type: DataTypes.TEXT,
        allowNull: false
    },

    notification_type: {
        type: DataTypes.STRING,
        allowNull: false
    },

    is_read: {
        type: DataTypes.BOOLEAN,
        defaultValue: false
    }

}, {
    tableName: "notifications",
    timestamps: true,
    createdAt: "created_at",
    updatedAt: false
});

module.exports = Notification;
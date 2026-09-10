const { DataTypes } = require("sequelize");
const sequelize = require("../config/database");

const management = sequelize.define("management", {
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true
    },

    user_id: {
        type: DataTypes.INTEGER,
        allowNull: false
    },

    name: {
        type: DataTypes.STRING,
        allowNull: false
    },

    designation: {
        type: DataTypes.STRING,
        allowNull: false
    },

    mobile_no: {
        type: DataTypes.STRING,
        allowNull: false
    },

    email: {
        type: DataTypes.STRING,
        allowNull: false
    },

    status: {
        type: DataTypes.STRING,
        allowNull: false,
        defaultValue: "active"
    }
}, {
    tableName: "management",
    timestamps: true,
    createdAt: "created_at",
    updatedAt: "updated_at"
});

module.exports = management;
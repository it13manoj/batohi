const { DataTypes } = require("sequelize");
const sequelize = require("../config/database");

const Location = sequelize.define("Location", {
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true
    },

    location_name: {
        type: DataTypes.STRING,
        allowNull: false
    },

    address: {
        type: DataTypes.STRING,
        allowNull: true
    },

    city: {
        type: DataTypes.STRING,
        allowNull: true
    },

    state: {
        type: DataTypes.STRING,
        allowNull: true
    },

    pincode: {
        type: DataTypes.STRING,
        allowNull: true
    },

    latitude: {
        type: DataTypes.DECIMAL(10, 7),
        allowNull: true
    },

    longitude: {
        type: DataTypes.DECIMAL(10, 7),
        allowNull: true
    },

    status: {
        type: DataTypes.ENUM("active", "inactive"),
        defaultValue: "active"
    }

}, {
    tableName: "locations",
    timestamps: true
});

module.exports = Location;
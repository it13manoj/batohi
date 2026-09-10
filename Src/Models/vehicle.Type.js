const { DataTypes } = require("sequelize");
const sequelize = require("../config/database");


const vehicleType = sequelize.define
    ("vehicleType",
        {
            id: {
                type: DataTypes.INTEGER,
                autoIncrement: true,
                primaryKey: true
            },

              vehicle_category:{
                type:DataTypes.ENUM("car", "bike","auto"),
                 allowNull:false

              },
            name: {
                type: DataTypes.STRING,
                allowNull: false
            },
            description: {
                type: DataTypes.TEXT,
                allowNull: false
            },
            seating_capacity: {
                type: DataTypes.INTEGER,
                allowNull: false
            },
            luggage_capacity: {
                type: DataTypes.INTEGER,
                allowNull: false
            },
            base_fare: {
                type: DataTypes.DECIMAL(10, 2),
                allowNull: false
            },
            per_km_rate: {
                type: DataTypes.DECIMAL(10, 2),
                allowNull: false

            },


        per_hour_rate: {
                type: DataTypes.DECIMAL(10, 2),
                allowNull: false
            },

            status: {
                type: DataTypes.STRING,
                allowNull: false,
                defaultValue: "active"
            }
        }, {
        tableName: "vehicle_types",
        timestamps: true,
        createdAt: "created",
        updatedAt: "updated_at"
    });

module.exports = vehicleType;
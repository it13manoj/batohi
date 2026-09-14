const { DataTypes } = require("sequelize");
const sequelize = require("../config/database");

const User = require("./user");
const Driver = require("./driver");

const Booked = sequelize.define(
  "Booked",
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true
    },

    user_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: User,
        key: "id"
      }
    },

    to: {
      type: DataTypes.STRING(500),
      allowNull: true
    },

    from: {
      type: DataTypes.STRING(500),
      allowNull: true
    },

    latitude_to: {
      type: DataTypes.DECIMAL(10, 8),
      allowNull: true
    },

    longitude_to: {
      type: DataTypes.DECIMAL(11, 8),
      allowNull: true
    },

    latitude_from: {
      type: DataTypes.DECIMAL(10, 8),
      allowNull: true
    },

    longitude_from: {
      type: DataTypes.DECIMAL(11, 8),
      allowNull: true
    },

    fare: {
      type: DataTypes.DECIMAL(10, 2), // Changed to standard currency format (e.g., 99999999.99)
      allowNull: true
    },

    distance: {
      type: DataTypes.STRING(500),
      allowNull: true
    },

    driver_id: {
      type: DataTypes.INTEGER,
      allowNull: true, // Set to true so pending bookings can exist without a driver assigned
      references: {
        model: User,
        key: "id"
      }
    },

    status: {
      type: DataTypes.ENUM(
        "pending",
        "accepted",
        "rejected",
        "completed",
        "cancelled"
      ),
      defaultValue: "pending"
    }
  },
  {
    tableName: "bookeds",
    timestamps: true,
    createdAt: "created_at",
    updatedAt: "updated_at"
  }
);

// Define Associations
Booked.belongsTo(User, { foreignKey: "user_id", as: "rider" });
Booked.belongsTo(User, { foreignKey: "driver_id", as: "driver" });

module.exports = Booked;
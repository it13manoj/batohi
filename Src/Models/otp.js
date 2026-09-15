const { DataTypes } = require("sequelize");
const sequelize = require("../config/database");
const Booked = require("./booked");

const OTP = sequelize.define(
  "Otp",
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true
    },

    booked_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: Booked,
        key: "id"
      }
    },

    otp: {
      type: DataTypes.INTEGER,
      allowNull: true
    },

    votp: {
      type: DataTypes.INTEGER,
      allowNull: true
    },

    
  },
  {
    tableName: "otps",
    timestamps: true,
    createdAt: "created_at",
    updatedAt: "updated_at"
  }
);

// Define Associations
Booked.hasOne(OTP, { foreignKey: "booked_id", as: "otp" });

module.exports = OTP;
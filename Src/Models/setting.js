const { DataTypes } = require("sequelize");
const sequelize = require("../config/database");

const Setting = sequelize.define(
  "Setting",
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    key: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },
    value: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
  },
  {
    tableName: "settings",
    timestamps: true,
    createdAt: "created_at",
    updatedAt: "updated_at",
  },
);

module.exports = Setting;

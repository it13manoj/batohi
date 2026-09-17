const { DataTypes } = require('sequelize');
const sequelize = require("../config/database");


const SubscriptionPlan = sequelize.define('SubscriptionPlan', {
  id: {
    type: DataTypes.STRING,
    primaryKey: true,
    allowNull: false
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false
  },
  vehicle_category: {
    type: DataTypes.ENUM('bike', 'auto', 'cab'),
    allowNull: false,
    defaultValue: 'bike'
  },
  cycle: {
    type: DataTypes.STRING, // e.g., '1_month', '3_months', '1_year'
    allowNull: false
  },
  durationLabel: {
    type: DataTypes.STRING, // e.g., '1 Month'
    allowNull: false,
    field: 'duration_label'
  },
  planTypeName: {
    type: DataTypes.STRING, // e.g., '1 Month'
    allowNull: false,
    field: 'plan_type_name'
  },
  price: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: false,
    defaultValue: 0.00
  },
  totalDays: {
    type: DataTypes.INTEGER, // e.g., 30
    allowNull: false,
    field: 'total_days'
  },
  isFreeTrial: {
    type: DataTypes.BOOLEAN,
    defaultValue: false,
    field: 'is_free_trial'
  },
  isActive: {
    type: DataTypes.BOOLEAN,
    defaultValue: true,
    field: 'is_active'
  }
}, {
  tableName: 'subscription_plans',
  timestamps: true,
  underscored: true
});

module.exports = SubscriptionPlan;

module.exports = SubscriptionPlan;
const { DataTypes } = require('sequelize');
const sequelize = require('../config/database'); // Adjust path to your db config

const DriverSubscription = sequelize.define('DriverSubscription', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true,
  },
  driverId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'drivers', // Name of your drivers table
      key: 'id'
    },
    onUpdate: 'CASCADE',
    onDelete: 'CASCADE'
  },
  planId: {
    type: DataTypes.STRING,
    allowNull: true,
    comment: 'Internal plan ID (e.g., bike_1m, auto_3m, car_1y)'
  },
  vehicleCategory: {
    type: DataTypes.ENUM('bike', 'auto', 'car'),
    allowNull: false,
    defaultValue: 'bike'
  },
  title: {
    type: DataTypes.STRING,
    allowNull: true,
    comment: 'Name of the subscription plan at time of purchase'
  },
  price: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: false,
    defaultValue: 0.00
  },
  cycle: {
    type: DataTypes.STRING,
    allowNull: true,
    defaultValue: '1_month',
    comment: 'Billing cycle identifier (1_month, 3_months, 6_months, 1_year)'
  },
  durationLabel: {
    type: DataTypes.STRING,
    allowNull: true,
    defaultValue: '1 Month'
  },
  baseMonths: {
    type: DataTypes.INTEGER,
    allowNull: true,
    defaultValue: 1
  },
  bonusDays: {
    type: DataTypes.INTEGER,
    allowNull: true,
    defaultValue: 0
  },
  bonusLabel: {
    type: DataTypes.STRING,
    allowNull: true,
    defaultValue: null
  },
  totalDays: {
    type: DataTypes.INTEGER,
    allowNull: false,
    defaultValue: 30
  },
  isFreeTrial: {
    type: DataTypes.BOOLEAN,
    allowNull: false,
    defaultValue: false
  },
  startDate: {
    type: DataTypes.DATE,
    allowNull: true
  },
  endDate: {
    type: DataTypes.DATE,
    allowNull: true
  },
  status: {
    type: DataTypes.ENUM('active', 'expired', 'cancelled'),
    allowNull: false,
    defaultValue: 'active'
  },
  transactionId: {
    type: DataTypes.STRING,
    allowNull: true
  },
  paymentMethod: {
    type: DataTypes.STRING,
    allowNull: true
  }
}, {
  tableName: 'driver_subscriptions',
  timestamps: true,
  underscored: true // Converts camelCase JS properties to snake_case in SQL
});

module.exports = DriverSubscription;
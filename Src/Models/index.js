const User = require("./user");
const Driver = require("./driver");
const Customer = require("./customer");
const Agent = require("./agent");
const Vehicle = require("./vehicle");
const VehicleType = require("./vehicle.Type");
const Booking = require("./booking");
const DriverVehicle = require("./driverVehicle");
const Role = require("./role");
const Trip = require("./trip");
const vehicleType = require("./vehicle.Type");
const DriverSubscription = require("./DriverSubscription");
const Transaction = require("./Transaction");
const SubscriptionPlan = require("./SubscriptionPlan");
const Coupon = require("./coupon");


// ================= USER ASSOCIATIONS =================

Role.hasOne(User, {
    foreignKey: "role_id",
    as: "users"
});

User.belongsTo(Role, {
    foreignKey: "role_id",
    as: "roles"
});

User.hasOne(Driver, {
    foreignKey: "user_id",
    as: "driver"
});

Driver.belongsTo(User, {
    foreignKey: "user_id",
    as: "user"
});


User.hasOne(Customer, {
    foreignKey: "user_id",
    as: "customer"
});

Customer.belongsTo(User, {
    foreignKey: "user_id",
    as: "user"
});


User.hasOne(Agent, {
    foreignKey: "user_id",
    as: "agent"
});

Agent.belongsTo(User, {
    foreignKey: "user_id",
    as: "user"
});


// ================= VEHICLE ASSOCIATIONS =================

VehicleType.hasMany(Vehicle, {
    foreignKey: "vehicle_type_id",
    as: "vehicles"
});

Vehicle.belongsTo(VehicleType, {
    foreignKey: "vehicle_type_id",
    as: "vehicleType"
});


// ================= DRIVER - VEHICLE =================

Driver.hasMany(DriverVehicle, {
    foreignKey: "driver_id",
    as: "driverVehicles"
});

DriverVehicle.belongsTo(Driver, {
    foreignKey: "driver_id",
    as: "driver"
});


Vehicle.hasMany(DriverVehicle, {
    foreignKey: "vehicle_id",
    as: "driverVehicles"
});

DriverVehicle.belongsTo(Vehicle, {
    foreignKey: "vehicle_id",
    as: "vehicle"
});


// ================= BOOKING =================

Booking.belongsTo(Customer, {
    foreignKey: "customer_id",
    as: "customer"
});

Booking.belongsTo(Agent, {
    foreignKey: "agent_id",
    as: "agent"
});

Booking.belongsTo(Driver, {
    foreignKey: "driver_id",
    as: "driver"
});

Booking.belongsTo(Vehicle, {
    foreignKey: "vehicle_id",
    as: "vehicle"
});

Booking.belongsTo(VehicleType, {
    foreignKey: "vehicle_type_id",
    as: "vehicleType"
});
// ================= TRIP ASSOCIATIONS =================

Driver.hasMany(Trip, {
    foreignKey: "driver_id",
    as: "trips"
});

Trip.belongsTo(Driver, {
    foreignKey: "driver_id",
    as: "driver"
});

Vehicle.hasMany(Trip, {
    foreignKey: "vehicle_id",
    as: "trips"
});

Trip.belongsTo(Vehicle, {
    foreignKey: "vehicle_id",
    as: "vehicle"
});

VehicleType.hasMany(Trip, {
    foreignKey: "vehicle_type_id",
    as: "trips"
});

Trip.belongsTo(VehicleType, {
    foreignKey: "vehicle_type_id",
    as: "vehicleType"
});
// ================= EXPORT =================

Driver.hasOne(Vehicle, { // or hasMany
    foreignKey: "driver_id",
    as: "vehicle"
});

// Vehicle belongs to a Driver
Vehicle.belongsTo(Driver, {
    foreignKey: "driver_id",
    as: "driver" // Changed alias from "vehicle" to "driver"
});

Driver.hasMany(DriverSubscription, { foreignKey: 'driver_id', onDelete: 'CASCADE' });
DriverSubscription.belongsTo(Driver, { foreignKey: 'driver_id' });

Driver.hasMany(Transaction, { foreignKey: 'driver_id' });
Transaction.belongsTo(Driver, { foreignKey: 'driver_id' });

// Plan Associations
SubscriptionPlan.hasMany(DriverSubscription, { foreignKey: 'plan_id' , as: 'subscriptionplan' });
DriverSubscription.belongsTo(SubscriptionPlan, { foreignKey: 'plan_id'  , as: 'subscriptionplan'});

SubscriptionPlan.hasMany(Transaction, { foreignKey: 'plan_id' });
Transaction.belongsTo(SubscriptionPlan, { foreignKey: 'plan_id' });


module.exports = {
    Role,
    User,
    Driver,
    Customer,
    Agent,
    Vehicle,
    VehicleType,
    Booking,
    DriverVehicle,
    Trip,
    SubscriptionPlan,
    DriverSubscription,
    Transaction,
    Coupon,
};
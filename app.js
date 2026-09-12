require("dotenv").config();
const http = require('http');
const express = require("express");
const { PORT } = process.env
const app = express();
const cors = require("cors")
const path = require("path"); 
const swaggerUi = require("swagger-ui-express");
const swaggerSpec = require("./Src/swagger/swagger");
const userRoute = require("./Src/Routes/user.route");
const sequelize = require("./Src/config/database");
const bodyparser = require("body-parser");
const customerRoute = require("./Src/Routes/customer.route");
const agentRoute = require("./Src/Routes/agent.route");
const adminRoute = require("./Src/Routes/admin.route")
const vehicleTypeRoute = require("./Src/Routes/vehicleType.route");
const vehicleRoute = require("./Src/Routes/vehicle.route");
const driverRoute = require("./Src/Routes/driver.route");
const bookingRoute = require("./Src/Routes/booking.route");
const paymentRoute = require("./Src/Routes/payment.route");
const bookingItemRoute = require("./Src/Routes/bookingitem");
const managementRoute = require("./Src/Routes/management.route");
const driverVehicleRoute = require("./Src/Routes/driverVehicle.route");
const customerAddressRoute = require("./Src/Routes/customerAdress.route");
const fareruleRoute = require("./Src/Routes/farerule.route")
const couponRoute = require("./Src/Routes/coupon.route");
const reviewRoute = require("./Src/Routes/review.route");
const notificationRoute = require("./Src/Routes/notification.route");
const locationRoute = require("./Src/Routes/location.route")
const roleRoutes = require("./Src/Routes/role.route");
const tripRoute = require("./Src/Routes/trip.route")


app.use(cors({
  origin: ["http://localhost:9000", "http://192.168.29.21:9000"],
  methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"],
  credentials: true
}));


app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ limit: '50mb', extended: true }));

app.use(bodyparser.json({ limit: '50mb' }));
app.use(bodyparser.urlencoded({ limit: '50mb', extended: true }));


app.use(
    "/uploads",
    express.static(path.join(__dirname, "Src/uploads"))
   
    
);


app.use("/api/v1/role", roleRoutes);
app.use("/api/v1/users", userRoute);
app.use("/api/v1/auth/driver", customerRoute);
app.use("/api/v1/agent", agentRoute);
app.use("/api/v1/admin", adminRoute);
app.use("/api/v1/management", managementRoute);
app.use("/api/v1/vehicleType", vehicleTypeRoute);
app.use("/api/v1/vehicle", vehicleRoute);
app.use("/api/v1/driver", driverRoute);
app.use("/api/v1/booking", bookingRoute);        
app.use("/api/v1/drivervehicle", driverVehicleRoute);
app.use("/api/v1/customerAddress", customerAddressRoute);
app.use("/api/v1/farerule", fareruleRoute);
app.use("/api/v1/coupon", couponRoute);
app.use("/api/v1/review", reviewRoute);
app.use("/api/v1/trip",tripRoute)
app.use("/api/v1/notification", notificationRoute);
app.use("/api/v1/locatiion",locationRoute)
app.use(
    "/api-docs",
    swaggerUi.serve,
    swaggerUi.setup(swaggerSpec)                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                
);

async function startServer() {
    try {
        await sequelize.authenticate();
        console.log("database connected");
        await sequelize.sync();
        console.log("database synced");
        http.createServer(app).listen(PORT, () => {
            console.log(`Server is running on port ${PORT}`);
        });
    } catch (error) {
        console.log("databse connection fail", error);

    }
}
startServer();
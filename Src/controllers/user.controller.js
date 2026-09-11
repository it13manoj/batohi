const bcrypt = require("bcrypt");
const fs = require("fs");
const path = require("path");
const { User, Customer, Role, Driver, Vehicle, VehicleType } = require("../Models/index")
// const User = require("../Models/user");
const { where } = require("sequelize");
const jwt = require("jsonwebtoken");
const sendResponse = require("../Utils/reponse");
// const Customer = require("../Models/customer");

const { Sequelize, Op } = require("sequelize");

exports.create = async (req, res) => {
    try {
        const {
            username,
            email,
            mobile,
            password,
            user_type,
            license_number,
            vehicle_number,
            agency_code
        } = req.body;

        // 1. Fetch the single role record matching the user_type
        const findRole = await Role.findOne({
            where: { name: user_type }
        });

        console.log(findRole, user_type);

        // 2. Validate that the role exists
        if (!findRole) {
            return sendResponse(res, 400, "Invalid user type or role not found");
        }

        // 3. Hash the password
        const hashedPassword = await bcrypt.hash(password, 10);

        // 4. Create the user with proper role ID and conditional fields
        const newUser = await User.create({
            username: username,
            email: email,
            mobile_no: mobile,
            password_hash: hashedPassword,
            user_type: user_type,
            role_id: findRole.id, // Extract the ID property from the found role
            ...(user_type === 'DRIVER' && {
                license_number,
                vehicle_number
            }),
            ...(user_type === 'AGENTS' && {
                agency_code
            })
        });

        return sendResponse(res, 200, "User created successfully", newUser);

    } catch (error) {
        console.error("User Creation Error:", error);
        return sendResponse(
            res,
            500,
            error.message || "Internal server error"
        );
    }
};


exports.login = async (req, res) => {
    try {

        const { email, password } = req.body;
        const user = await User.findOne({
            where: {
                email: email,
                is_deleted: false,
                is_blocked: false,
                status: true
            }
        });
        if (!user) {
            return res.send("User not found")
        }

        const isMatch = await bcrypt.compare(
            password,
            user.password_hash,
        );


        const token = jwt.sign(
            {
                id: user.id,
                email: user.email,
                type: user.user_type,
                status: user.status
            },
            process.env.JWT_SECRET,
            {
                expiresIn: process.env.JWT_EXPIRES_IN
            }
        );


        if (!isMatch) {
            return res.send("Invalid password");
        }
        res.send({ token: token });


    } catch (error) {
        console.log(error);
        res.status(500).send(error.message);
    }
};

exports.profile = async (req, res) => {
    try {
        let profileImage = "";
        const { firstName, lastName, gender, dateOfBirth, address, city, state, pincode } = req.body
        if (req.file) {
            profileImage = req.file.filename;
        }
        const customer = await Customer.findOne({
            where: { user_id: req.user.id },

        });

        console.log(profileImage);

        if (customer) {

            const oldFilePath = path.join(
                __dirname,
                `../uploads/images/${req.user.type}/${req.user.id}/profile/.*`
            );
            if (fs.existsSync(oldFilePath)) {
                fs.unlinkSync(oldFilePath);
            }
            await Customer.update(
                {
                    first_name: firstName,
                    last_name: lastName,
                    gender: gender,
                    date_of_birth: dateOfBirth,
                    profile_image: profileImage,
                    address: address,
                    city: city,
                    state: state,
                    pincode: pincode
                },
                {
                    where: {
                        user_id: req.user.id
                    }
                }
            );
        } else {

            await Customer.create(
                {
                    user_id: req.user.id,
                    first_name: firstName,
                    last_name: lastName,
                    gender: gender,
                    date_of_birth: dateOfBirth,
                    profile_image: profileImage,
                    address: address,
                    city: city,
                    state: state,
                    pincode: pincode
                }
            );
        }
        res.send({ status: 200, message: "Successfully profile created!" })
    } catch (e) {
        res.send({ status: 404, message: e })
    }
}

exports.getProfile = async (req, res) => {
    try {

        const userId = req.user.id;

        const customer = await Customer.findOne({
            where: {
                user_id: userId
            },
            include: [
                {
                    model: User,
                    as: 'user', // Must match 'as: "user"' from Customer.belongsTo
                    attributes: ['id', 'username', 'email', 'mobile_no', 'status'] // Exclude sensitive fields like password
                }
            ]
        });

        if (!customer) {
            return res.status(404).json({
                success: false,
                statusCode: 404,
                message: "Customer profile not found",
                data: null
            });
        }

        return res.status(200).json({
            success: true,
            statusCode: 200,
            message: "Customer profile fetched successfully",
            data: customer
        });

    } catch (error) {

        console.log(error);

        return res.status(500).json({
            success: false,
            statusCode: 500,
            message: "Failed to fetch customer profile",
            data: null,
            error: error.message
        });
    }
};

exports.find = async (req, res) => {
    try {
        const userRes = await User.findAll();
        if (userRes.length > 0) {
            res.send(userRes)
        } else {
            res.send("User not found")
        }
    }
    catch (error) {
        res.send(error)
    }
};


exports.findById = async (req, res) => {

    const { id } = req.user;

    try {
        const userRes = await User.findByPk(id, {
            attributes: {
                exclude: ["password_hash"]
            }
        });

        console.log(userRes);

        if (userRes) {
            res.send(userRes);
        } else {
            res.send("User not found");
        }

    } catch (error) {
        res.send(error);
    }
};

exports.update = async (req, res) => {
    try {
        const id = req.params.id;
        const userRes = await User.update({
            email: req.body.email,
            username: req.body.username,
            mobile_no: req.body.mobile_no
        },
            {
                where: { id: id }
            }
        );
        res.send("User updated successfully");

    } catch (error) {
        res.send(error);
    }
};


exports.destroy = async (req, res) => {
    try {
        const id = req.params.id;
        await User.destroy({
            where: { id: id }
        });
        res.send("user destroy")
    } catch (error) {
        res.send(error);
    }
}


exports.updateLocation = async (req, res) => {
    try {
        const { latitude, longitude } = req.body;
        const userId = req.user.id; // Extracted from JWT middleware

        // Basic coordinate validation
        if (latitude === undefined || longitude === undefined) {
            return sendResponse(res, 400, "Latitude and longitude are required");
        }

        const [updatedRows] = await User.update(
            {
                latitude: parseFloat(latitude),
                longitude: parseFloat(longitude),
                last_located_at: new Date()
            },
            {
                where: { id: userId }
            }
        );

        if (updatedRows === 0) {
            return sendResponse(res, 44, "User not found");
        }

        return sendResponse(res, 200, "Location updated successfully", {
            latitude,
            longitude,
            last_located_at: new Date()
        });

    } catch (error) {
        console.error("Update Location Error:", error);
        return sendResponse(
            res,
            500,
            error.message || "Failed to update location"
        );
    }
};


// exports.findNearestDrivers = async (req, res) => {
//   try {
//     const { latitude, longitude, radius = 10 } = req.query; // radius in km (default 10km)

//     if (!latitude || !longitude) {
//       return res.status(400).json({
//         success: false,
//         message: "Latitude and Longitude are required."
//       });
//     }

//     const userLat = parseFloat(latitude);
//     const userLng = parseFloat(longitude);

//     // 6371 is the Earth's radius in kilometers (use 3959 for miles)
//     const distanceFormula = Sequelize.literal(`
//       (6371 * acos(
//         cos(radians(${userLat})) 
//         * cos(radians(User.latitude)) 
//         * cos(radians(User.longitude) - radians(${userLng})) 
//         + sin(radians(${userLat})) 
//         * sin(radians(User.latitude))
//       ))
//     `);

//    const drivers = await Driver.findAll({
//   where: {
//     status: "active"
//   },
//   attributes: {
//     include: [[distanceFormula, "distance_km"]]
//   },
//   include: [
//     {
//       model: User,
//       as: "user",
//       attributes: ["id", "username", "mobile_no", "latitude", "longitude"],
//       where: {
//         latitude: { [Op.ne]: null },
//         longitude: { [Op.ne]: null }
//       }
//     },
//     {
//       model: Vehicle,
//       as: "vehicle",
//       include: [
//         {
//           model: VehicleType, // Ensure VehicleType model is imported correctly
//           as: "vehicleType"
//         }
//       ]
//     }
//   ],
//   having: Sequelize.literal(`distance_km <= ${radius}`),
//   order: [[Sequelize.literal("distance_km"), "ASC"]],
//   limit: 10
// });

//     return res.status(200).json({
//       success: true,
//       count: drivers.length,
//       data: drivers
//     });

//   } catch (error) {
//     console.error("Find Nearest Drivers Error:", error);
//     return res.status(500).json({
//       success: false,
//       message: "Server error searching for nearby drivers."
//     });
//   }
// };


const calculateHaversineDistance = (lat1, lon1, lat2, lon2) => {
    const R = 6371; // Earth's radius in km
    const dLat = (lat2 - lat1) * (Math.PI / 180);
    const dLon = (lon2 - lon1) * (Math.PI / 180);
    const a =
        Math.sin(dLat / 2) * Math.sin(dLat / 2) +
        Math.cos(lat1 * (Math.PI / 180)) *
        Math.cos(lat2 * (Math.PI / 180)) *
        Math.sin(dLon / 2) *
        Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return parseFloat((R * c).toFixed(2)); // Distance in km
};

exports.findNearestDrivers = async (req, res) => {
    try {
        const {
            fromLat,
            fromLng,
            toLat,
            toLng,
            vehicleType,
            radius = 10
        } = req.query;

        // Validate pickup coordinates
        if (!fromLat || !fromLng) {
            return res.status(400).json({
                success: false,
                message: "Pickup coordinates (fromLat, fromLng) are required."
            });
        }

        const pickupLat = parseFloat(fromLat);
        const pickupLng = parseFloat(fromLng);
        const dropLat = toLat ? parseFloat(toLat) : null;
        const dropLng = toLng ? parseFloat(toLng) : null;
        const searchRadius = parseFloat(radius);

        // Calculate Trip Distance if Drop location is provided
        let tripDistanceKm = 0;
        if (dropLat && dropLng) {
            tripDistanceKm = calculateHaversineDistance(pickupLat, pickupLng, dropLat, dropLng);
        }

        // SQL Formula to calculate Driver distance to Pickup location
        const driverDistanceFormula = Sequelize.literal(`
      (6371 * acos(
        cos(radians(${pickupLat})) 
        * cos(radians(\`user\`.\`latitude\`)) 
        * cos(radians(\`user\`.\`longitude\`) - radians(${pickupLng})) 
        + sin(radians(${pickupLat})) 
        * sin(radians(\`user\`.\`latitude\`))
      ))
    `);

        // Build Vehicle filter if vehicleType is provided
        const vehicleTypeFilter = {};
  

        // Query active drivers nearby
        const drivers = await Driver.findAll({
            where: { status: "active" },
            attributes: {
                include: [[driverDistanceFormula, "distance_km"]]
            },
            include: [
                {
                    model: User,
                    as: "user",
                    attributes: ["id", "username", "mobile_no", "latitude", "longitude"],
                    where: {
                        latitude: { [Op.ne]: null },
                        longitude: { [Op.ne]: null }
                    }
                },
                {
                    model: Vehicle,
                    as: "vehicle",
                    required: true,
                    include: [
                        {
                            model: VehicleType,
                            as: "vehicleType",
                            where: vehicleType ? vehicleTypeFilter : undefined,
                            required: true
                        }
                    ]
                }
            ],
            having: Sequelize.literal(`distance_km <= ${searchRadius}`),
            order: [[Sequelize.literal("distance_km"), "ASC"]],
            limit: 10
        });

        // Format final response payload
        const formattedDrivers = drivers.map((driver) => {
            const driverObj = driver.toJSON();
            const driverToPickupKm = parseFloat(driverObj.distance_km || 0);

            // Default pricing standard if not present in VehicleType table
            const baseFare = driverObj.vehicle?.vehicleType?.base_price || 30;
            const ratePerKm = driverObj.vehicle?.vehicleType?.price_per_km || 12;

            // Estimated Trip Fare & Timing Calculations
            const estimatedFare = Math.round(baseFare + tripDistanceKm * ratePerKm);
            const driverEtaMins = Math.ceil((driverToPickupKm / 25) * 60); // Speed 25km/h
            const tripDurationMins = Math.ceil((tripDistanceKm / 30) * 60); // Speed 30km/h

            return {
                ...driverObj,
                driver_distance_to_pickup_km: driverToPickupKm.toFixed(2),
                driver_eta_mins: driverEtaMins <= 1 ? 1 : driverEtaMins,
                trip_details: {
                    trip_distance_km: tripDistanceKm,
                    estimated_fare: estimatedFare,
                    estimated_trip_mins: tripDurationMins
                }
            };
        });

        return res.status(200).json({
            success: true,
            count: formattedDrivers.length,
            trip_distance_km: tripDistanceKm,
            data: formattedDrivers
        });

    } catch (error) {
        console.error("Find Nearest Drivers Error:", error);
        return res.status(500).json({
            success: false,
            message: "Server error searching for nearby drivers."
        });
    }
};
const bcrypt = require("bcrypt");
const fs = require("fs");
const path = require("path");
const { User, Customer, Role, Driver, Vehicle, VehicleType, OTP, DriverSubscription } = require("../Models/index");
const { where, Sequelize, Op } = require("sequelize");
const jwt = require("jsonwebtoken");
const sendResponse = require("../Utils/reponse");
const driverData = require("../Utils/driver.json");

const { sendRegistrationEmail, sendOtpEmail } = require("../Utils/email");

exports.create = async (req, res) => {
  try {
    const {
      username,
      email,
      mobile_no,
      mobile,
      password,
      user_type,
      license_number,
      vehicle_number,
      agency_code,
    } = req.body;

    const phone = mobile_no || mobile;

    // 1. Find Role
    const findRole = await Role.findOne({
      where: { name: user_type },
    });

    console.log("ROLE:", findRole, "USER TYPE:", user_type);

    // 2. Validate Role
    if (!findRole) {
      return sendResponse(res, 400, "Invalid user type or role not found");
    }

    // 3. Hash Password
    const hashedPassword = await bcrypt.hash(password, 10);

    // 4. Create User
    const newUser = await User.create({
      username: username,
      email: email,
      mobile_no: phone,
      password_hash: hashedPassword,
      user_type: user_type,
      role_id: findRole.id,

      ...(user_type === "DRIVER" && {
        license_number,
        vehicle_number,
      }),

      ...(user_type === "AGENTS" && {
        agency_code,
      }),
    });

    // 5. Create Driver
    if (user_type === "DRIVER") {
      const driverColumn = {
        ...driverData,
        driver_code:`DRI-${new Date().getFullYear()}-${newUser.id}`,
        driving_license_no: license_number,
        user_id: newUser.id,
        first_name: username ? username.split(" ")?.[0] : "",
        last_name: username ? username.split(" ")?.[1] || "" : "",
        email: email,
        mobile_number: phone,
        aadhaar_number: Date.now(),
        pan_number:Date.now(),
      };

      await Driver.create(driverColumn);
    }

    // 6. Send Registration Email
    try {
      await sendRegistrationEmail(email, username);
      console.log("✅ Registration email sent successfully");
    } catch (emailError) {
      console.error("❌ Registration email failed:", emailError.message);
    }

    // 7. Final Response
    return sendResponse(res, 200, "User created successfully", newUser);
  } catch (error) {
    console.error("User Creation Error:", error);
    return sendResponse(res, 500, error.message || "Internal server error");
  }
};

exports.login = async (req, res) => {
  try {
    const { email, password, role } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: "Email and password are required",
      });
    }

    // =========================
    // FIND USER (Support flexible role or fallback to email)
    // =========================
    const cleanEmail = email.trim();
    const whereCondition = {
      email: cleanEmail,
      is_deleted: false,
      user_type: { [Op.notIn]: ["ADMIN"] },
    };

    if (role && role !== "ALL") {
      const normalizedRole = role.toUpperCase();
      if (normalizedRole === "AGENT" || normalizedRole === "AGENTS") {
        whereCondition.user_type = { [Op.in]: ["AGENT", "AGENTS"] };
      } else {
        whereCondition.user_type = normalizedRole;
      }
    }

  

    let user = await User.findOne({ where: whereCondition });

    // Fallback: If not found with specific role, match by email directly
    if (!user && role) {
      user = await User.findOne({
        where: {
          email: cleanEmail,
          is_deleted: false,
          user_type: { [Op.notIn]: ["ADMIN"] },
        },
      });
    }

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "Account not found with this email",
      });
    }

    // Explicit check to block ADMIN role logins
    if (user.user_type && user.user_type.toUpperCase() === "ADMIN") {
      return res.status(403).json({
        success: false,
        message: "Admin accounts are not allowed to log in through this portal.",
      });
    }

    if (user.is_blocked) {
      return res.status(403).json({
        success: false,
        message: "Account is blocked. Please contact support.",
      });
    }

    if (user.status === false) {
      return res.status(403).json({
        success: false,
        message: "Account is inactive. Please contact administrator.",
      });
    }

    // =========================
    // PASSWORD VERIFY
    // =========================
    const isMatch = await bcrypt.compare(password, user.password_hash);

    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: "Invalid credentials. Please check your password.",
      });
    }

    // =========================
    // GENERATE 6 DIGIT OTP
    // =========================
    const generatedOtp = Math.floor(100000 + Math.random() * 900000).toString();

    // OTP EXPIRY (10 MINUTES)
    const otpExpiry = new Date(Date.now() + 10 * 60 * 1000);

    // Delete previous OTPs for this user
    await OTP.destroy({
      where: {
        user_id: user.id,
      },
    });

    // Save new OTP in OTP table
    await OTP.create({
      user_id: user.id,
      otp: generatedOtp,
      booked_id: null,
      otp_expiry: otpExpiry,
    });

    // SEND REAL-TIME OTP EMAIL
    try {
      await sendOtpEmail(user.email, user.username || "User", generatedOtp);
      console.log(`✅ Real-time OTP sent to ${user.email}`);
    } catch (emailError) {
      console.error("❌ Send OTP email failed:", emailError.message);
      return res.status(500).json({
        success: false,
        message: `Unable to send OTP to ${user.email}. Please verify your email or try again.`,
        error: emailError.message,
      });
    }

    console.log("LOGIN OTP GENERATED:", generatedOtp, "USER ID:", user.id);

    // =========================
    // RESPONSE FOR OTP VERIFICATION PANEL
    // =========================
    return res.status(200).json({
      success: true,
      message: `A 6-digit OTP code has been sent to ${user.email}`,
      user_id: user.id,
      email: user.email,
      user_type: user.user_type,
      otp_required: true,
    });
  } catch (error) {
    console.error("Login Error:", error);

    return res.status(500).json({
      success: false,
      message: "Login failed",
      error: error.message,
    });
  }
};
exports.verifyOtp = async (req, res) => {
  try {
    const { user_id, email, otp: enteredOtp } = req.body;

    // Check required fields
    if ((!user_id && !email) || !enteredOtp) {
      return res.status(400).json({
        success: false,
        message: "user_id or email, and otp are required",
      });
    }

    // Find user by user_id or email
    let user;
    if (user_id) {
      user = await User.findByPk(user_id);
    } else if (email) {
      user = await User.findOne({ where: { email: String(email).trim() } });
    }

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    const inputOtp = String(enteredOtp).trim();

    // Find OTP in DB
    const otpData = await OTP.findOne({
      where: {
        user_id: user.id,
        otp: inputOtp,
      },
      order: [["created_at", "DESC"]],
    });

    if (!otpData) {
      return res.status(400).json({
        success: false,
        message: "Invalid OTP. Please enter the 6-digit code received on your email.",
      });
    }

    // Check expiry
    const expiryTime = otpData.otp_expiry
      ? new Date(otpData.otp_expiry)
      : new Date(new Date(otpData.created_at).getTime() + 10 * 60 * 1000);

    if (new Date() > expiryTime) {
      await OTP.destroy({ where: { id: otpData.id } });
      return res.status(400).json({
        success: false,
        message: "OTP has expired. Please click 'Resend OTP' to get a new code.",
      });
    }

    // Delete used OTP
    await OTP.destroy({ where: { id: otpData.id } });

    // Update user to verified
    await User.update({ is_verified: true }, { where: { id: user.id } });

    // JWT SESSION EXPIRATION: 30 DAYS (1 MONTH)
    const token = jwt.sign(
      {
        id: user.id,
        email: user.email,
        type: user.user_type,
        status: user.status,
      },
      process.env.JWT_SECRET || "batohiDriverProjects",
      {
        expiresIn: process.env.JWT_EXPIRES_IN || "30d",
      },
    );

    return res.status(200).json({
      success: true,
      message: "OTP verified successfully",
      token: token,
      user: {
        id: user.id,
        username: user.username,
        email: user.email,
        mobile_no: user.mobile_no,
        user_type: user.user_type,
        status: user.status,
        is_verified: true,
      },
    });
  } catch (error) {
    console.error("OTP Verify Error:", error);
    return res.status(500).json({
      success: false,
      message: "OTP verification failed",
      error: error.message,
    });
  }
};

exports.resendOtp = async (req, res) => {
  try {
    const { user_id, email } = req.body;
    if (!user_id && !email) {
      return res.status(400).json({
        success: false,
        message: "user_id or email is required",
      });
    }

    let user;
    if (user_id) {
      user = await User.findByPk(user_id);
    } else if (email) {
      user = await User.findOne({ where: { email: String(email).trim() } });
    }

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    const generatedOtp = Math.floor(100000 + Math.random() * 900000).toString();

    const otpExpiry = new Date(Date.now() + 10 * 60 * 1000);

    await OTP.destroy({ where: { user_id: user.id } });
    await OTP.create({
      user_id: user.id,
      otp: generatedOtp,
      booked_id: null,
      otp_expiry: otpExpiry,
    });

    try {
      await sendOtpEmail(user.email, user.username || "User", generatedOtp);
      console.log(`✅ Real-time OTP resent to ${user.email}`);
    } catch (e) {
      console.error("Resend OTP email error:", e.message);
      return res.status(500).json({
        success: false,
        message: `Failed to deliver OTP to ${user.email}: ${e.message}`,
        error: e.message,
      });
    }

    return res.status(200).json({
      success: true,
      message: `A new 6-digit OTP code has been sent to ${user.email}`,
      user_id: user.id,
      email: user.email,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Failed to resend OTP",
      error: error.message,
    });
  }
};

exports.profile = async (req, res) => {
  try {
    let profileImage = "";
    const { firstName, lastName, gender, dateOfBirth, address, city, state, pincode } = req.body;
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
        `../uploads/images/${req.user.type}/${req.user.id}/profile/.*`,
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
          pincode: pincode,
        },
        {
          where: {
            user_id: req.user.id,
          },
        },
      );
    } else {
      await Customer.create({
        user_id: req.user.id,
        first_name: firstName,
        last_name: lastName,
        gender: gender,
        date_of_birth: dateOfBirth,
        profile_image: profileImage,
        address: address,
        city: city,
        state: state,
        pincode: pincode,
      });
    }
    res.send({ status: 200, message: "Successfully profile created!" });
  } catch (e) {
    res.send({ status: 404, message: e });
  }
};

exports.getProfile = async (req, res) => {
  try {
    const userId = req.user.id;

    const customer = await Customer.findOne({
      where: {
        user_id: userId,
      },
      include: [
        {
          model: User,
          as: "user", // Must match 'as: "user"' from Customer.belongsTo
          attributes: ["id", "username", "email", "mobile_no", "status"], // Exclude sensitive fields like password
        },
      ],
    });

    if (!customer) {
      return res.status(404).json({
        success: false,
        statusCode: 404,
        message: "Customer profile not found",
        data: null,
      });
    }

    return res.status(200).json({
      success: true,
      statusCode: 200,
      message: "Customer profile fetched successfully",
      data: customer,
    });
  } catch (error) {
    console.log(error);

    return res.status(500).json({
      success: false,
      statusCode: 500,
      message: "Failed to fetch customer profile",
      data: null,
      error: error.message,
    });
  }
};

exports.find = async (req, res) => {
  try {
    const userRes = await User.findAll();
    if (userRes.length > 0) {
      res.send(userRes);
    } else {
      res.send("User not found");
    }
  } catch (error) {
    res.send(error);
  }
};

exports.findById = async (req, res) => {
  const { id } = req.user;

  try {
    const userRes = await User.findByPk(id, {
      attributes: {
        exclude: ["password_hash"],
      },
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
    const userRes = await User.update(
      {
        email: req.body.email,
        username: req.body.username,
        mobile_no: req.body.mobile_no || req.body.mobile,
      },
      {
        where: { id: id },
      },
    );
    res.send("User updated successfully");
  } catch (error) {
    res.send(error);
  }
};

exports.destroy = async (req, res) => {
  try {
    const id = req.body.id || req.params.id;

    if (!id) {
      return res.status(400).json({
        success: false,
        message: "User id is required",
      });
    }

    const deleted = await User.destroy({
      where: { id: id },
    });

    if (deleted === 0) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "User destroyed successfully",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to destroy user",
      error: error.message,
    });
  }
};

exports.Delete = exports.destroy;

exports.updateLocation = async (req, res) => {
  try {
    const { latitude, longitude } = req.body;
    const userId = req.user.id; // Extracted from JWT middleware

    // Basic coordinate validation
    if (latitude === undefined || longitude === undefined) {
      return sendResponse(res, 400, "Latitude and longitude are required");
    }

    const updatedRows = await User.update(
      {
        latitude: parseFloat(latitude),
        longitude: parseFloat(longitude),
        last_located_at: new Date(),
      },
      {
        where: { id: userId },
      },
    );

    if (updatedRows === 0) {
      return sendResponse(res, 301, "User not found");
    }

    return sendResponse(res, 200, "Location updated successfully", {
      latitude,
      longitude,
      last_located_at: new Date(),
    });
  } catch (error) {
    console.error("Update Location Error:", error);
    return sendResponse(res, 500, error.message || "Failed to update location");
  }
};

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
    const { fromLat, fromLng, toLat, toLng, vehicleType, radius = 5 } = req.query;

    if (!fromLat || !fromLng) {
      return res.status(400).json({
        success: false,
        message: "Pickup coordinates (fromLat, fromLng) are required.",
      });
    }

    const pickupLat = parseFloat(fromLat);
    const pickupLng = parseFloat(fromLng);
    const dropLat = toLat ? parseFloat(toLat) : null;
    const dropLng = toLng ? parseFloat(toLng) : null;
    const searchRadius = parseFloat(radius);

    let tripDistanceKm = 0;
    if (dropLat && dropLng) {
      tripDistanceKm = calculateHaversineDistance(pickupLat, pickupLng, dropLat, dropLng);
    }

    // STEP 1: Get user IDs of drivers with active subscriptions
    const activeSubscribers = await DriverSubscription.findAll({
      attributes: ["vehicleCategory"],
      where: { 
        status: "active",
        ...(vehicleType ? { vehicleCategory: vehicleType } : {})
      },
      include: [
        {
          model: Driver,
          as: "subscriptionDriver", // Make sure this alias matches DriverSubscription -> Driver
          attributes: ["user_id"],
        }
      ]
    });

    // Extract user_ids with active subscriptions
    const activeUserIds = activeSubscribers
      .map(sub => sub.subscriptionDriver?.user_id)
      .filter(Boolean);

    // If no driver has an active subscription, return early
    if (activeUserIds.length === 0) {
      return res.status(200).json({ success: true, count: 0, data: [] });
    }

    // Distance formula
    const driverDistanceFormula = Sequelize.literal(`
      (6371 * acos(
        cos(radians(${pickupLat})) 
        * cos(radians(\`user\`.\`latitude\`)) 
        * cos(radians(\`user\`.\`longitude\`) - radians(${pickupLng})) 
        + sin(radians(${pickupLat})) 
        * sin(radians(\`user\`.\`latitude\`))
      ))
    `);

    // STEP 2: Find active drivers matching the subscribed user_ids
    const drivers = await Driver.findAll({
      where: { 
        status: "active",
        user_id: { [Op.in]: activeUserIds } // Filter by subscribed drivers only
      },
      attributes: {
        include: [[driverDistanceFormula, "distance_km"]],
      },
      include: [
        {
          model: User,
          as: "user",
          attributes: ["id", "username", "mobile_no", "latitude", "longitude", "device_token"],
          where: {
            latitude: { [Op.ne]: null },
            longitude: { [Op.ne]: null },
          },
          required: true,
        },
        {
          model: Vehicle,
          as: "vehicle",
          where: { status: "active" }, // Active vehicle required
          required: true,
          include: [
            {
              model: VehicleType,
              as: "vehicleType",
              where: {
                status: "active",
                ...(vehicleType ? { vehicle_category: vehicleType } : {}),
              },
              required: true,
            },
          ],
        },
      ],
      having: Sequelize.literal(`distance_km <= ${searchRadius}`),
      order: [[Sequelize.literal("distance_km"), "ASC"]],
      limit: 10,
    });

    // Format response
    const formattedDrivers = drivers.map((driver) => {
      const driverObj = driver.toJSON();
      const driverToPickupKm = parseFloat(driverObj.distance_km || 0);

      const baseFare = driverObj.vehicle?.vehicleType?.base_price || 30;
      const ratePerKm = driverObj.vehicle?.vehicleType?.price_per_km || 12;

      const estimatedFare = Math.round(baseFare + tripDistanceKm * ratePerKm);
      const driverEtaMins = Math.ceil((driverToPickupKm / 25) * 60);
      const tripDurationMins = Math.ceil((tripDistanceKm / 30) * 60);

      return {
        ...driverObj,
        driver_distance_to_pickup_km: driverToPickupKm.toFixed(2),
        driver_eta_mins: driverEtaMins <= 1 ? 1 : driverEtaMins,
        trip_details: {
          trip_distance_km: tripDistanceKm,
          estimated_fare: estimatedFare,
          estimated_trip_mins: tripDurationMins,
        },
      };
    });

    return res.status(200).json({
      success: true,
      count: formattedDrivers.length,
      trip_distance_km: tripDistanceKm,
      data: formattedDrivers,
    });

  } catch (error) {
    console.error("Find Nearest Drivers Error:", error);
    return res.status(500).json({
      success: false,
      message: "Server error searching for nearby drivers.",
    });
  }
};




exports.deviceToken = async (req, res) => {
  try {
    const { deviceToken } = req.body;
    const userId = req.user.id;

    if (!deviceToken) {
      return res.status(400).json({
        success: false,
        message: "Device token is required",
      });
    }
    // Check user
    const user = await User.findOne({
      where: {
        id: userId,
      },
      logging: console.log,
    });

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }
    // Update token
    const [updatedRows] = await User.update(
      {
        device_token: deviceToken,
      },
      {
        where: {
          id: userId,
        },
        logging: console.log,
      },
    );

    return res.status(200).json({
      success: true,
      message: "Device token saved successfully",
      data: {
        userId,
        updatedRows,
      },
    });
  } catch (error) {
    console.error("Error saving device token:", error);

    return res.status(500).json({
      success: false,
      message: "Internal server error",
      error: error.message,
    });
  }
};

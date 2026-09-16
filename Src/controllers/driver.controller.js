const fs = require("fs");
const path = require("path");
const { Driver, User, Role, Vehicle } = require("../Models");
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken')
const booking = require("../Models/booking")
const bookingItem = require("../Models/booking.Item");
const sendResponse = require("../Utils/reponse");
require('../config/firebaseAdmin')
const { Op } = require("sequelize");
const sendPushNotification = require('../Utils/notification')


const { getMessaging } = require('firebase-admin/messaging');
const Booked = require("../Models/booked");
const generateOTP = require("../Utils/otp");
const OTP = require("../Models/otp");

const DEFAULT_NOTIFICATION_ICON = 'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="96" height="96" viewBox="0 0 24 24" fill="%234CAF50"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/></svg>';

exports.create = async (req, res) => {
    try {

        const { username, email, mobile, password } = req.body;


        const password_hash = await bcrypt.hash(password, 10);

        const users = await User.create({
            username, email, mobile_no: mobile, password_hash, user_type: "DRIVER", status: 1, is_verified: 0,
        });
        res.send("Driver created successfully");

    } catch (error) {
        console.log(error);
        res.status(500).send(error.message);
    }
};


exports.login = async (req, res) => {
    try {

        const { email, password } = req.body;
        console.log(email, password);
        if (!email || !password) {
            return res.status.json(400)({
                message: "Email and password are required"
            });
        }

        const user = await User.findOne({
            where: {
                email: email,
                user_type: "DRIVER",
                status: true
            }
        });

        console.log(user, "Hello Word");


        if (!user) {
            return res.status(404).json({
                message: "User not found"
            });
        }

        const isMatch = await bcrypt.compare(
            password,
            user.password_hash
        );

        if (!isMatch) {
            return res.status.json(401)({
                message: "Invalid password"
            });
        }

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

        res.status(200).json({
            message: "Driver login successful",
            token: token
        });

    } catch (error) {

        console.log(error);

        res.status(500).json({
            message: "Login failed",
            error: error.message
        });

    }
};


exports.profile = async (req, res) => {
    try {

        const userId = req.user.id;
        const userType = req.user.type;

        const { firstName, lastName, gender, dateOfBirth, address, city, state, pincode, mobileNo, driverCode, licenseExpiryDate, experienceYears, aadhaarNumber, alternateMobile, drivingLicenseNo, licenseIssueDate, panNumber, emergencyContactName, emergencyContactNumber } = req.body

        console.log(firstName, lastName, gender, dateOfBirth, address, city, state, pincode, mobileNo, driverCode, licenseExpiryDate, experienceYears, aadhaarNumber, alternateMobile, drivingLicenseNo, licenseIssueDate, panNumber, emergencyContactName, emergencyContactNumber);


        let profileImage = req.files?.profileImage?.[0];
        let adharImage = req.files?.adharImage?.[0];
        let panCard = req.files?.panCard?.[0];
        let license = req.files?.licenseImage?.[0];

        if (profileImage) {
            profileImage = `/images/${userType}/${userId}/profile/${profileImage.filename}`;
        }

        if (adharImage) {
            adharImage = `/images/${userType}/${userId}/adharCard/${adharImage.filename}`
        }
        if (panCard) {
            panCard = `/images/${userType}/${userId}/panCard/${panCard.filename}`
        }
        if (license) {
            license = `/images/${userType}/${userId}/licenseImage/${license.filename}`
        }
        console.log(profileImage, adharImage, panCard, license);

        const drivers = await Driver.findOne({ where: { user_id: req.user.id } })

        if (drivers?.id) {
            const oldFilePath = path.join(
                __dirname,
                `../uploads/images/${req.user.type}/${req.user.id}/${drivers.profile_image}`
            );
            if (fs.existsSync(oldFilePath)) {
                fs.unlinkSync(oldFilePath);
            }
            await Driver.update(
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
                    driver_code: driverCode,
                    mobile_number: mobileNo,
                    email: req.user.email,
                    alternate_mobile: alternateMobile,
                    driving_license_no: drivingLicenseNo,
                    license_issue_date: licenseIssueDate,
                    license_expiry_date: licenseExpiryDate,
                    license_image: license,
                    experience_years: experienceYears,
                    aadhaar_number: aadhaarNumber,
                    aadhaar_image: adharImage,
                    pan_number: panNumber,
                    pan_image: panCard,
                    emergency_contact_name: emergencyContactName,
                    emergency_contact_number: emergencyContactNumber,
                },
                {
                    where: {
                        user_id: req.user.id
                    }
                }
            );
        } else {
            await Driver.create(
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
                    pincode: pincode,
                    driver_code: driverCode,
                    mobile_number: mobileNo,
                    email: req.user.email,
                    alternate_mobile: alternateMobile,
                    driving_license_no: drivingLicenseNo,
                    license_issue_date: licenseIssueDate,
                    license_expiry_date: licenseExpiryDate,
                    license_image: license,
                    experience_years: experienceYears,
                    aadhaar_number: aadhaarNumber,
                    aadhaar_image: adharImage,
                    pan_number: panNumber,
                    pan_image: panCard,
                    emergency_contact_name: emergencyContactName,
                    emergency_contact_number: emergencyContactNumber,
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

        const driver = await Driver.findOne({
            where: {
                user_id: req.user.id
            },

            include: [
                {
                    model: User,
                    as: "user",
                    attributes: {
                        exclude: ["password_hash"]
                    },
                    include: [
                        {
                            model: Role,
                            as: "roles"
                        }
                    ]
                }
            ]
        });

        if (!driver) {
            return res.status(404).json({
                status: 404,
                message: "Driver profile not found",
                data: []
            });
        }

        res.status(200).json({
            status: 200,
            data: driver
        });

    } catch (e) {

        console.log(e);

        res.status(500).json({
            status: 500,
            message: "Failed to get driver profile",
            data: []
        });
    }
};


exports.dashboard = async (req, res) => {
    try {
        // 1. Validate that user_id exists on req
        if (!req.user.id) {
            return sendResponse(res, 401, "Unauthorized: User ID missing");
        }

        // 2. Fetch driver data with inclusions
        const response = await Driver.findOne({
            where: {
                user_id: req.user.id,
                status: "active"
            },
            include: [
                {
                    model: User,
                    as: "user",
                    attributes: {
                        exclude: ["password_hash"]
                    }
                },
                {
                    model: Vehicle,
                    as: "vehicle",
                    where: {
                        status: "active"
                    }
                }
            ]
        });

        // 3. Handle non-existent driver record
        if (!response) {
            return sendResponse(res, 404, "Driver record not found");
        }

        // 4. Return success response
        return sendResponse(res, 200, "Successfully fetched records!", response);

    } catch (error) {
        // 5. Handle unexpected server errors
        console.error("Dashboard Fetch Error:", error);
        return sendResponse(res, 500, "An internal server error occurred", error.message);
    }
};


exports.status = async (req, res) => {
    try {
        let { id } = req.params;

        if (id === "null") {
            // Verify user context exists
            if (!req.user?.id) {
                return res.status(401).json({ success: false, message: "Unauthorized user" });
            }

            // 2. Fallback to driver record using logged-in user's ID
            const driver = await Driver.findOne({ where: { user_id: req.user.id } });
            if (!driver) {
                return res.status(404).json({ success: false, message: "Driver record not found" });
            }
            id = driver.id;
        }



        // 1. Find the driver by primary key
        const driver = await Driver.findByPk(id);



        // 2. Handle missing record
        if (!driver) {
            return res.status(404).json({
                success: false,
                message: "Driver not found"
            });
        }

        // 3. Toggle the status (adjust property name if using driver.state)
        const newStatus = driver.status === "active" ? "inactive" : "active";

        // 4. Update using standard Sequelize syntax
        await Driver.update(
            { status: newStatus }, // Values to update
            { where: { id } }     // Query conditions
        );

        // 5. Send HTTP response back to client
        return res.status(200).json({
            success: true,
            message: `Driver status updated to ${newStatus}`,
            status: newStatus
        });

    } catch (error) {
        console.error("Error toggling driver status:", error);
        return res.status(500).json({
            success: false,
            message: "Internal server error"
        });
    }
};


exports.findRider = async (req, res) => {
    try {
        const { id } = req.params;
        const { to, from, latitude_to, longitude_to, latitude_from, longitude_from, fare, distance } = req.body

        const rider = await Driver.findByPk(id, {
            include: [
                {
                    model: User,
                    as: "user",
                    attributes: {
                        exclude: ["password_hash"]
                    }
                },
            ]
        });

        if (!rider) {
            return res.status(404).json({
                success: false,
                message: "Rider not found"
            });
        }

        if (!rider.user || !rider.user.device_token) {
            return res.status(400).json({
                success: false,
                message: "Driver device token is not registered for notifications"
            });
        }

        const message = {
            token: rider.user.device_token,
            notification: {
                title: 'New Ride Request',
                body: 'You have a new ride request. Please check!'
            },
            data: {
                type: 'ride_request',
                riderId: String(id)
            },
            android: {
                priority: 'high',
                notification: {
                    channelId: 'batohi_rides',
                    sound: 'default'
                }
            },
            apns: {
                payload: {
                    aps: {
                        sound: 'default',
                        contentAvailable: true
                    }
                }
            },
            webpush: {
                notification: {
                    title: 'New Ride Request',
                    body: 'You have a new ride request. Please check!',
                    icon: DEFAULT_NOTIFICATION_ICON,
                    requireInteraction: true
                },
                fcmOptions: {
                    link: '/'
                }
            }
        }


        const distanceInKm = calculateDistance(latitude_to,longitude_to,latitude_from, longitude_from, 'km');

        const response = await getMessaging().send(message)
        const userId = req.user.id;
        const newBooking = await Booked.create({
            user_id: userId,
            to: to,
            from: from,
            latitude_to: latitude_to,
            longitude_to: longitude_to,
            latitude_from: latitude_from,
            longitude_from: longitude_from,
            fare: fare,
            distance: `${distanceInKm.toFixed(2)} km`,
            driver_id: rider.user_id || null,
            status: 'pending' // explicit status initialization
        });
        const otp = generateOTP(6);

        await OTP.create({
            booked_id: newBooking.id,
            otp: otp
        })


        return res.status(200).json({
            success: true,
            message: 'Notification sent successfully',
            fcmResponse: response,
            data: newBooking
        });

    } catch (error) {
        console.error("Find Rider Error:", error);

        return res.status(500).json({
            success: false,
            message: "Internal server error",
            error: error.message
        });
    }
};

exports.listOfBookedUsers = async (req, res) => {
    try {
        // 1. Build where clause dynamically based on user type
        const whereCondition = {
            status: {
                [Op.in]: ["pending", "accepted","confirmed"] // Matches records where status is pending OR accepted
            }
        };

        if (req.user.type === "DRIVER") {
            whereCondition.driver_id = req.user.id;
        } else {
            whereCondition.user_id = req.user.id;
        }

        // 2. Fetch pending bookings matching the user ID
        const response = await Booked.findAll({
            where: whereCondition,
            include: [
                {
                    model: User,
                    as: "rider",
                    attributes: ["id", "username", "email", "mobile_no"]
                }
            ],
            order: [["created_at", "DESC"]] // Most recent requests first
        });

        return res.status(200).json({
            success: true,
            count: response.length,
            data: response
        });

    } catch (error) {
        console.error("Error in listOfBookedUsers:", error);
        return res.status(500).json({
            success: false,
            message: "Failed to fetch pending ride requests.",
            error: error.message
        });
    }
};

exports.acceptRide = async (req, res) => {
    try {
        const { bookingId } = req.params
        const driverId = req.user.id // Assumes auth middleware sets req.user

        // 1. Find the pending booking assigned to this driver
        const booking = await Booked.findOne({
            where: {
                id: bookingId,
                driver_id: driverId,
                status: 'pending'
            }
        })

        if (!booking) {
            return res.status(404).json({
                success: false,
                message: 'Ride request not found or already processed.'
            })
        }

        // 2. Update status to accepted
        booking.status = 'accepted'
        await booking.save()

        const rider = await User.findByPk(booking.user_id)
        if (rider && rider.device_token) {
            await sendPushNotification(rider.device_token, {
                title: 'Ride Accepted! 🚗',
                body: 'Your driver is on the way to pick you up.',
                icon: DEFAULT_NOTIFICATION_ICON,
                data: {
                    booking_id: booking.id,
                    status: 'accepted'
                }
            })
        }

        return res.status(200).json({
            success: true,
            message: 'Ride accepted successfully.',
            booking
        })
    } catch (error) {
        console.error('Error in acceptRide:', error)
        return res.status(500).json({
            success: false,
            message: 'Failed to accept ride request.',
            error: error.message
        })
    }
}

// REJECT RIDE REQUEST
exports.rejectRide = async (req, res) => {
    try {
        const { bookingId } = req.params
        const driverId = req.user.id

        const booking = await Booked.findOne({
            where: {
                id: bookingId,
                driver_id: driverId,
                status: 'pending'
            }
        })

        if (!booking) {
            return res.status(404).json({
                success: false,
                message: 'Ride request not found or already processed.'
            })
        }

        // Update status to rejected
        booking.status = 'rejected'
        await booking.save()
        const rider = await User.findByPk(booking.user_id)
        if (rider && rider.device_token) {
            await sendPushNotification(rider.device_token, {
                title: 'Ride Request Declined ❌',
                body: 'Your driver is unavailable. We are searching for another driver.',
                icon: DEFAULT_NOTIFICATION_ICON,
                data: {
                    booking_id: booking.id,
                    status: 'rejected'
                }
            })
        }
        return res.status(200).json({
            success: true,
            message: 'Ride request rejected.',
            booking
        })
    } catch (error) {
        console.error('Error in rejectRide:', error)
        return res.status(500).json({
            success: false,
            message: 'Failed to reject ride request.',
            error: error.message
        })
    }
}

exports.completeRide = async (req, res) => {
    try {
        const { bookingId } = req.params
        const driverId = req.user.id

        const booking = await Booked.findOne({
            where: {
                id: bookingId,
                driver_id: driverId,
                status: 'confirmed'
            }
        })

        if (!booking) {
            return res.status(404).json({
                success: false,
                message: 'Ride request not found or already processed.'
            })
        }

        // Update status to rejected
        booking.status = 'completed'
        await booking.save()
        const rider = await User.findByPk(booking.user_id)
        if (rider && rider.device_token) {
            await sendPushNotification(rider.device_token, {
                title: 'Ride successfully completed!',
                body: 'Your ride is completed. thanks for visiting',
                icon: DEFAULT_NOTIFICATION_ICON,
                data: {
                    booking_id: booking.id,
                    status: 'completed'
                }
            })
        }
        return res.status(200).json({
            success: true,
            message: 'Ride request completed.',
            booking
        })
    } catch (error) {
        console.error('Error in completedRide:', error)
        return res.status(500).json({
            success: false,
            message: 'completed ride request.',
            error: error.message
        })
    }
}

exports.cancelRide = async (req, res) => {
    try {
        const { bookingId } = req.params
        const driverId = req.user.id

        const booking = await Booked.findOne({
            where: {
                id: bookingId,
                user_id: driverId,
                status: 'pending'
            }
        })

        if (!booking) {
            return res.status(404).json({
                success: false,
                message: 'Ride request not found or already processed.'
            })
        }

        // Update status to rejected
        booking.status = 'cancelled'
        await booking.save()
        const rider = await User.findByPk(booking.user_id)
        if (rider && rider.device_token) {
            await sendPushNotification(rider.device_token, {
                title: 'Ride successfully cancelled!',
                body: 'Your ride is completed. thanks for visiting',
                icon: DEFAULT_NOTIFICATION_ICON,
                data: {
                    booking_id: booking.id,
                    status: 'cancelled'
                }
            })
        }
        return res.status(200).json({
            success: true,
            message: 'Ride request cancelled.',
            booking
        })
    } catch (error) {
        console.error('Error in cancelledRide:', error)
        return res.status(500).json({
            success: false,
            message: 'cancelled ride request.',
            error: error.message
        })
    }
}



exports.bookedStatus = async (req, res) => {
    try {
        const { id } = req.params;
        const whereCondition = {
            id: Number(id) // Ensure ID is cast to a Number
        };

        // Conditionally check user type
        if (req.user && req.user.type === "DRIVER") {
            whereCondition.driver_id = req.user.id;
        } else if (req.user) {
            whereCondition.user_id = req.user.id;
        }

        const response = await Booked.findOne({
            where: whereCondition,
            include: [
                {
                    model: User,
                    as: "rider",
                    attributes: ["id", "username", "email", "mobile_no", "latitude", "longitude"]
                },
                {
                    model: OTP,
                    as: "otp", // Match the alias defined in Booked.hasOne / Booked.hasMany
                    required: false // Optional: prevents query failure if no OTP row exists yet
                },
                {
                    model: User,
                    as: "driver",
                    attributes: ["id", "username", "email", "mobile_no", "latitude", "longitude"],
                    include: [{
                        model: Driver,
                        as: "driver",
                        required: false,
                        where: { status: "active" },
                        include: [{
                            model: Vehicle,
                            as: "vehicle",
                            required: false,
                            where: { status: "active" }
                        }]
                    }]
                }
            ]
        });
        if (!response) {
            console.log("No record found for condition:", whereCondition);
            return res.status(404).json({
                success: false,
                message: "Booking record not found or unauthorized access."
            });
        }

        return res.status(200).json({
            success: true,
            data: response
        });

    } catch (error) {
        console.error("Error in bookedStatus:", error);
        return res.status(500).json({
            success: false,
            message: "Failed to fetch booking status.",
            error: error.message
        });
    }
};

exports.booked = async (req, res) => {
    try {
        const userId = req.user.id;
        const userType = req.user.type;

        // 1. Correctly isolate queries based on role
        let whereCondition = {};
        if (userType === "DRIVER") {
            whereCondition = { driver_id: userId };
        } else {
            whereCondition = { user_id: userId };
        }

        const response = await Booked.findAll({
            where: whereCondition,
            include: [
                {
                    model: User,
                    as: "rider",
                    attributes: ["id", "username", "email", "mobile_no", "latitude", "longitude"]
                },
                {
                    model: User,
                    as: "driver",
                    attributes: ["id", "username", "email", "mobile_no", "latitude", "longitude"],
                    include: [
                        {
                            model: Driver,
                            as: "driver",
                            // required: false prevents INNER JOIN from excluding historical/cancelled rides
                            required: false,
                            where: { status: "active" },
                            include: [
                                {
                                    model: Vehicle,
                                    as: "vehicle",
                                    required: false,
                                    where: { status: "active" }
                                }
                            ]
                        }
                    ]
                }
            ],
            // Fix Sequelize syntax for ordering
            order: [["id", "DESC"]]
        });

        // 2. Handle empty results safely (findAll returns an array [])
        if (!response || response.length === 0) {
            return res.status(200).json({
                success: true,
                data: [],
                message: "No booking records found."
            });
        }

        return res.status(200).json({
            success: true,
            data: response
        });

    } catch (error) {
        console.error("Error in booked controller:", error);
        return res.status(500).json({
            success: false,
            message: "Failed to fetch booking status.",
            error: error.message
        });
    }
};

exports.startRide = async (req, res) => {
  try {
    const { booking_id, otp } = req.body;

    // 1. Verify OTP with await
    const otpRecord = await OTP.findOne({
      where: {
        booked_id: booking_id,
        otp: otp
      }
    });

    if (!otpRecord) {
      return res.status(400).json({
        success: false,
        message: "Invalid OTP or Booking ID"
      });
    }

    // 2. Update booking status using the correct booking_id
    const [updatedRows] = await Booked.update(
      { status: "confirmed" },
      {
        where: {
          id: booking_id
        }
      }
    );

    if (updatedRows === 0) {
      return res.status(404).json({
        success: false,
        message: "Booking record not found"
      });
    }

    return res.status(200).json({
      success: true,
      message: "Ride started successfully",
      data: {
        booking_id,
        status: "confirmed"
      }
    });

  } catch (error) {
    console.error("Error starting ride:", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error while starting ride",
      error: error.message
    });
  }
};

exports.bothLocation = async (req, res) => {
    try {
        const response = await Booked.findOne({
            where: {
                status: "accepted",
                driver_id: req.user.id
            },
            include: [
                {
                    model: User,
                    as: "rider",
                    // Explicitly fetch ONLY coordinates
                    attributes: ["id", "latitude", "longitude"]
                },
                {
                    model: User,
                    as: "driver",
                    // Explicitly fetch ONLY coordinates
                    attributes: ["id", "latitude", "longitude"]
                }
            ]
        });

        if (!response) {
            return res.status(404).json({
                success: false,
                message: "Booking not found or unauthorized access."
            });
        }

        return res.status(200).json({
            success: true,
            data: response
        });

    } catch (error) {
        console.error("Error fetching location data:", error);
        return res.status(500).json({
            success: false,
            message: "Internal server error",
            error: error.message
        });
    }
};


/**
 * Calculates the distance between two coordinates using the Haversine formula.
 * @param {number} lat1 - Latitude of point 1
 * @param {number} lon1 - Longitude of point 1
 * @param {number} lat2 - Latitude of point 2
 * @param {number} lon2 - Longitude of point 2
 * @param {string} unit - 'km' (default), 'm' (meters), or 'miles'
 * @returns {number} Distance in chosen unit
 */
function calculateDistance(lat1, lon1, lat2, lon2, unit = 'km') {
  const EARTH_RADIUS_KM = 6371; // Earth's mean radius in kilometers

  // Convert degrees to radians
  const toRadians = (degree) => (degree * Math.PI) / 180;

  const dLat = toRadians(lat2 - lat1);
  const dLon = toRadians(lon2 - lon1);

  const radLat1 = toRadians(lat1);
  const radLat2 = toRadians(lat2);

  // Haversine formula
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(radLat1) * Math.cos(radLat2) *
    Math.sin(dLon / 2) * Math.sin(dLon / 2);

  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  const distanceKm = EARTH_RADIUS_KM * c;

  // Convert output unit
  if (unit === 'm') return distanceKm * 1000;
  if (unit === 'miles') return distanceKm * 0.621371;
  return distanceKm; // Default: km
}





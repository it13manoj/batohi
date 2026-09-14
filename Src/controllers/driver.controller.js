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
                body: 'A rider is waiting for you!'
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
                    icon: '/assets/notification.png',
                    requireInteraction: true
                },
                fcmOptions: {
                    link: '/'
                }
            }
        }

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
            distance: distance,
            driver_id: rider.user_id || null,
            status: 'pending' // explicit status initialization
        });


        return res.status(200).json({
            success: true,
            message: 'Notification sent successfully',
            fcmResponse: response,
            data: rider
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
        // 1. Calculate the start of today (00:00:00)
        const startOfToday = new Date();
        startOfToday.setHours(0, 0, 0, 0);

        // 2. Fetch pending bookings for this driver created today
        const response = await Booked.findAll({
            where: {
                status: "pending",
                driver_id: req.user.id

            },
            include: [
                {
                    model: User,
                    as: "rider",
                    attributes: ["id", "username", "email", "mobile_no"] // Exclude sensitive fields like password
                }
            ],
            order: [["created_at", "DESC"]] // Show most recent requests first
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
                icon: './assets/notification.png',
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
                icon: './assets/notification.png',
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

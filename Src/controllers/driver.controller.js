const fs = require("fs");
const path = require("path");
const { Driver, User, Role } = require("../Models");
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken')
const booking = require("../Models/booking")
const bookingItem = require("../Models/booking.Item")



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



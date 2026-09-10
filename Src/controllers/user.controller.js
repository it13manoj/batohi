const bcrypt = require("bcrypt");
const fs = require("fs");
const path = require("path");
const {User, Customer, Role} = require("../Models/index")
// const User = require("../Models/user");
const { where } = require("sequelize");
const jwt = require("jsonwebtoken");
const sendResponse = require("../Utils/reponse");
// const Customer = require("../Models/customer");
const Booking = require("../Models/booking");
const Vehicle = require("../Models/vehicle");
const VehicleType = require("../Models/vehicle.Type");
const Driver = require("../Models/driver");


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



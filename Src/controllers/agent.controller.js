const  Agent = require("../Models/agent");
const bcrypt = require('bcrypt');
const User = require("../Models/user");
const jwt = require("jsonwebtoken")


exports.create = async (req, res) => {
    try {
        const {
            user_id,
            agent_code,
            agency_name,
            business_type,
            contact_person,
            mobile_no,
            email,
            address,
            city,
            state,
            pincode,
            commission_percentage,
            status
        } = req.body;

        await Agent.create({
            user_id: user_id,
            agent_code: agent_code,
            agency_name: agency_name,
            business_type:business_type,
            contact_person: contact_person,
            mobile_no: mobile_no,
            email: email,
            address: address,
            city: city,
            state: state,
            pincode: pincode,
            commission_percentage: commission_percentage,
            status: status
        });

        res.send("Agent created successfully");

    } catch (error) {
        res.send(error.message);
    }
};

exports.login = async (req, res) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({
                message: "Email and password are required"
            });
        }

        const user = await User.findOne({
            where: {
                email: email
            }
        });

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
            return res.status(401).json({
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
                expiresIn: process.env.JWT_EXPIRES_IN || "1d"
            }
        );

        return res.status(200).json({
            message: "Login successful",
            token: token
        });

    } catch (error) {
        console.log(error);

        return res.status(500).json({
            message: "Login failed",
            error: error.message
        });
    }
};
exports.getAll = async (req, res) => {
    try {

        const agents = await Agent.findAll({
            attributes: [
                "id",
                "user_id",
                "agent_code",
                "agency_name",
                "contact_person",
                "mobile_no",
                "email",
                "status"
            ]
        });

        return res.status(200).json({
            success: true,
            count: agents.length,
            data: agents
        });

    } catch (error) {

        return res.status(500).json({
            success: false,
            message: "Failed to fetch agents",
            error: error.message
        });
    }
};
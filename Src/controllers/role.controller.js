const Role = require("../Models/role");
const sendResponse = require("../Utils/reponse");


exports.create = async (req, res) => {
    try {

        const { name, status } = req.body;

        // Check role already exists
        const existingRole = await Role.findOne({
            where: {
                name: name
            }
        });

        if (existingRole) {
            return res.status(400).json({
                success: false,
                message: "Role already exists"
            });
        }

        // Create role
        const role = await Role.create({
            name: name,
            status: status ?? true
        });

        res.status(201).json({
            success: true,
            message: "Role created successfully",
            data: role
        });

    } catch (error) {

        console.log(error);

        res.status(500).json({
            success: false,
            message: "Role creation failed",
            error: error.message
        });
    }
};

exports.find = async (req, res) => {
    try {
        const roles = await Role.findAll({
            order: [["id", "DESC"]]
        });
        return sendResponse(
            res,
            200,
            roles
        );
    } catch (e) {
        return sendResponse(
            res,
            404,
            e
        );
    }
}
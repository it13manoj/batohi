const Admin = require("../Models/admin");

exports.create = async (req, res) => {
    try {
        const {
            user_id,
            admin_name,
            role,
            status
        } = req.body;

        await Admin.create({
            user_id: user_id,
            admin_name: admin_name,
            role: role,
            status: status
        });

        res.send("Admin created successfully");

    } catch (error) {
        res.send(error.message);
    }
};
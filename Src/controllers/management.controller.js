const Management = require("../Models/management");

// CREATE
exports.create = async (req, res) => {
    try {
        const {
            user_id,
            name,
            designation,
            mobile_no,
            email,
            status
        } = req.body;

        await Management.create({
            user_id,
            name,
            designation,
            mobile_no,
            email,
            status
        });

        res.send( "management created succesfully");

    } catch (error) {
        res.send(error);
    }
};
const Location = require("../Models/location");

// Create Location
exports.create = async (req, res) => {
    try {
        const location = await Location.create({
            location_name: req.body.location_name,
            address: req.body.address,
            city: req.body.city,
            state: req.body.state,
            pincode: req.body.pincode,
            latitude: req.body.latitude,
            longitude: req.body.longitude,
            status: req.body.status || "active"
        });

        res.status(201).json({
            message: "Location created successfully",
            data: location
        });

    } catch (error) {
        res.status(500).json({
            message: "Location creation failed",
            error: error.message
        });
    }
};


// Get All Locations
exports.getAll = async (req, res) => {
    try {
        const locations = await Location.findAll({
            order: [["id", "DESC"]]
        });

        res.status(200).json({
            message: "Locations fetched successfully",
            data: locations
        });

    } catch (error) {
        res.status(500).json({
            message: "Failed to fetch locations",
            error: error.message
        });
    }
};


// Get Location By ID
exports.getById = async (req, res) => {
    try {
        const location = await Location.findByPk(req.params.id);

        if (!location) {
            return res.status(404).json({
                message: "Location not found"
            });
        }

        res.status(200).json({
            message: "Location fetched successfully",
            data: location
        });

    } catch (error) {
        res.status(500).json({
            message: "Failed to fetch location",
            error: error.message
        });
    }
};


// Update Location
exports.update = async (req, res) => {
    try {
        const location = await Location.findByPk(req.params.id);

        if (!location) {
            return res.status(404).json({
                message: "Location not found"
            });
        }

        await location.update({
            location_name: req.body.location_name,
            address: req.body.address,
            city: req.body.city,
            state: req.body.state,
            pincode: req.body.pincode,
            latitude: req.body.latitude,
            longitude: req.body.longitude,
            status: req.body.status
        });

        res.status(200).json({
            message: "Location updated successfully",
            data: location
        });

    } catch (error) {
        res.status(500).json({
            message: "Location update failed",
            error: error.message
        });
    }
};


// Delete Location
exports.delete = async (req, res) => {
    try {
        const location = await Location.findByPk(req.params.id);

        if (!location) {
            return res.status(404).json({
                message: "Location not found"
            });
        }

        await location.destroy();

        res.status(200).json({
            message: "Location deleted successfully"
        });

    } catch (error) {
        res.status(500).json({
            message: "Location deletion failed",
            error: error.message
        });
    }
};
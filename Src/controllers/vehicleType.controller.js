const VehicleType = require("../Models/vehicle.Type");
const sendResponse = require("../Utils/reponse");
const { Op } = require("sequelize");

/**
 * 1. Create a new Vehicle Type
 */
exports.create = async (req, res) => {
    try {
        const {
            vehicle_category,
            name,
            description,
            seating_capacity,
            luggage_capacity,
            base_fare,
            per_km_rate,
            per_hour_rate,
            status = "active"
        } = req.body;

        if (!name || !vehicle_category) {
            return sendResponse(
                res,
                400,
                "Name and vehicle_category are required"
            );
        }

        const validCategories = ["car", "bike", "auto"];
        const normalizedCategory = vehicle_category.toLowerCase();
        if (!validCategories.includes(normalizedCategory)) {
            return sendResponse(
                res,
                400,
                `Invalid vehicle_category. Allowed values are: ${validCategories.join(", ")}`
            );
        }

        const normalizedStatus = status.toLowerCase() === "inactive" ? "inactive" : "active";

        const newType = await VehicleType.create({
            user_id: req.user ? req.user.id : 1,
            vehicle_category: normalizedCategory,
            name,
            description: description || `${name} vehicle type`,
            seating_capacity: seating_capacity !== undefined ? parseInt(seating_capacity) : 4,
            luggage_capacity: luggage_capacity !== undefined ? parseInt(luggage_capacity) : 2,
            base_fare: base_fare !== undefined ? parseFloat(base_fare) : 50.00,
            per_km_rate: per_km_rate !== undefined ? parseFloat(per_km_rate) : 12.00,
            per_hour_rate: per_hour_rate !== undefined ? parseFloat(per_hour_rate) : 100.00,
            status: normalizedStatus
        });

        return sendResponse(
            res,
            201,
            "Vehicle type created successfully",
            newType
        );

    } catch (error) {
        console.error("Create Vehicle Type Error:", error);
        return sendResponse(
            res,
            500,
            error.message || "Failed to create vehicle type"
        );
    }
};

/**
 * 2. Get All Vehicle Types (with optional filters: ?status=active/inactive & ?category=car)
 */
exports.getType = async (req, res) => {
    try {
        const { status, category, vehicle_category } = req.query;
        const whereClause = {};

        // Optional status filter (?status=active or ?status=inactive)
        if (status) {
            whereClause.status = status.toLowerCase();
        }

        const cat = category || vehicle_category;
        if (cat) {
            whereClause.vehicle_category = cat.toLowerCase();
        }

        const response = await VehicleType.findAll({
            where: whereClause,
            order: [["id", "ASC"]]
        });

        return sendResponse(
            res,
            200,
            "Successfully fetched records!",
            response
        );
    } catch (error) {
        console.error("Get Vehicle Types Error:", error);
        return sendResponse(
            res,
            500,
            error.message || "Failed to fetch vehicle types"
        );
    }
};

exports.getAll = exports.getType;

/**
 * 3. Get Only Active Vehicle Types (for rider / booking selection)
 */
exports.getActive = async (req, res) => {
    try {
        const { category, vehicle_category } = req.query;
        const whereClause = { status: "active" };

        const cat = category || vehicle_category;
        if (cat) {
            whereClause.vehicle_category = cat.toLowerCase();
        }

        const activeTypes = await VehicleType.findAll({
            where: whereClause,
            order: [["id", "ASC"]]
        });

        return sendResponse(
            res,
            200,
            "Active vehicle types fetched successfully",
            activeTypes
        );
    } catch (error) {
        console.error("Get Active Vehicle Types Error:", error);
        return sendResponse(
            res,
            500,
            error.message || "Failed to fetch active vehicle types"
        );
    }
};

/**
 * 4. Get Vehicle Type By ID
 */
exports.getById = async (req, res) => {
    try {
        const { id } = req.params;
        const vt = await VehicleType.findByPk(id);

        if (!vt) {
            return sendResponse(res, 404, "Vehicle type not found");
        }

        return sendResponse(res, 200, "Vehicle type retrieved successfully", vt);
    } catch (error) {
        console.error("Get Vehicle Type By ID Error:", error);
        return sendResponse(res, 500, error.message || "Failed to fetch vehicle type");
    }
};

/**
 * 5. Update Status (Active / Inactive)
 * Payload: { "status": "active" } or { "status": "inactive" }
 */
exports.updateStatus = async (req, res) => {
    try {
        const { id } = req.params;
        const { status } = req.body;

        if (!status) {
            return sendResponse(
                res,
                400,
                "Status is required ('active' or 'inactive')"
            );
        }

        const normalizedStatus = status.toLowerCase();
        if (normalizedStatus !== "active" && normalizedStatus !== "inactive") {
            return sendResponse(
                res,
                400,
                "Invalid status value. Must be 'active' or 'inactive'"
            );
        }

        const vt = await VehicleType.findByPk(id);
        if (!vt) {
            return sendResponse(res, 404, "Vehicle type not found");
        }

        await vt.update({ status: normalizedStatus });

        return sendResponse(
            res,
            200,
            `Vehicle type marked as ${normalizedStatus} successfully`,
            vt
        );

    } catch (error) {
        console.error("Update Vehicle Type Status Error:", error);
        return sendResponse(
            res,
            500,
            error.message || "Failed to update vehicle type status"
        );
    }
};

/**
 * 6. Toggle Status (Active <-> Inactive)
 */
exports.toggleStatus = async (req, res) => {
    try {
        const { id } = req.params;
        const vt = await VehicleType.findByPk(id);

        if (!vt) {
            return sendResponse(res, 404, "Vehicle type not found");
        }

        const nextStatus = vt.status === "active" ? "inactive" : "active";
        await vt.update({ status: nextStatus });

        return sendResponse(
            res,
            200,
            `Vehicle type status toggled to ${nextStatus}`,
            vt
        );

    } catch (error) {
        console.error("Toggle Vehicle Type Status Error:", error);
        return sendResponse(
            res,
            500,
            error.message || "Failed to toggle vehicle type status"
        );
    }
};

/**
 * 7. Explicit Activate
 */
exports.activate = async (req, res) => {
    try {
        const { id } = req.params;
        const vt = await VehicleType.findByPk(id);

        if (!vt) {
            return sendResponse(res, 404, "Vehicle type not found");
        }

        await vt.update({ status: "active" });

        return sendResponse(
            res,
            200,
            "Vehicle type activated successfully",
            vt
        );
    } catch (error) {
        console.error("Activate Vehicle Type Error:", error);
        return sendResponse(
            res,
            500,
            error.message || "Failed to activate vehicle type"
        );
    }
};

/**
 * 8. Explicit Deactivate
 */
exports.deactivate = async (req, res) => {
    try {
        const { id } = req.params;
        const vt = await VehicleType.findByPk(id);

        if (!vt) {
            return sendResponse(res, 404, "Vehicle type not found");
        }

        await vt.update({ status: "inactive" });

        return sendResponse(
            res,
            200,
            "Vehicle type deactivated successfully",
            vt
        );
    } catch (error) {
        console.error("Deactivate Vehicle Type Error:", error);
        return sendResponse(
            res,
            500,
            error.message || "Failed to deactivate vehicle type"
        );
    }
};

/**
 * 9. Update Vehicle Type Details
 */
exports.update = async (req, res) => {
    try {
        const { id } = req.params;
        const vt = await VehicleType.findByPk(id);

        if (!vt) {
            return sendResponse(res, 404, "Vehicle type not found");
        }

        const {
            name,
            vehicle_category,
            description,
            seating_capacity,
            luggage_capacity,
            base_fare,
            per_km_rate,
            per_hour_rate,
            status
        } = req.body;

        const updateData = {};
        if (name) updateData.name = name;
        if (vehicle_category) updateData.vehicle_category = vehicle_category.toLowerCase();
        if (description !== undefined) updateData.description = description;
        if (seating_capacity !== undefined) updateData.seating_capacity = parseInt(seating_capacity);
        if (luggage_capacity !== undefined) updateData.luggage_capacity = parseInt(luggage_capacity);
        if (base_fare !== undefined) updateData.base_fare = parseFloat(base_fare);
        if (per_km_rate !== undefined) updateData.per_km_rate = parseFloat(per_km_rate);
        if (per_hour_rate !== undefined) updateData.per_hour_rate = parseFloat(per_hour_rate);
        if (status) updateData.status = status.toLowerCase() === "inactive" ? "inactive" : "active";

        await vt.update(updateData);

        return sendResponse(
            res,
            200,
            "Vehicle type updated successfully",
            vt
        );

    } catch (error) {
        console.error("Update Vehicle Type Error:", error);
        return sendResponse(
            res,
            500,
            error.message || "Failed to update vehicle type"
        );
    }
};

/**
 * 10. Delete Vehicle Type
 */
exports.deleteType = async (req, res) => {
    try {
        const { id } = req.params;
        const vt = await VehicleType.findByPk(id);

        if (!vt) {
            return sendResponse(res, 404, "Vehicle type not found");
        }

        await vt.destroy();

        return sendResponse(
            res,
            200,
            "Vehicle type deleted successfully"
        );
    } catch (error) {
        console.error("Delete Vehicle Type Error:", error);
        return sendResponse(
            res,
            500,
            error.message || "Failed to delete vehicle type"
        );
    }
};
const express = require("express");
const {
    create,
    getType,
    getAll,
    getActive,
    getById,
    updateStatus,
    toggleStatus,
    activate,
    deactivate,
    update,
    deleteType
} = require("../controllers/vehicleType.controller");
const authMiddleware = require("../Middleware/auth.middleware");

const Route = express.Router();

// 1. Creation and retrieval
Route.post("/create", authMiddleware, create);
Route.get("/vehicle-types", authMiddleware, getType);
Route.get("/all", authMiddleware, getAll);
Route.get("/active", getActive); // Available for riders to see active options
Route.get("/:id", authMiddleware, getById);

// 2. Active / Inactive Status Management
Route.patch("/status/:id", authMiddleware, updateStatus);
Route.put("/status/:id", authMiddleware, updateStatus);
Route.patch("/toggle-status/:id", authMiddleware, toggleStatus);
Route.patch("/activate/:id", authMiddleware, activate);
Route.patch("/deactivate/:id", authMiddleware, deactivate);

// 3. Full update and deletion
Route.put("/update/:id", authMiddleware, update);
Route.delete("/delete/:id", authMiddleware, deleteType);

module.exports = Route;
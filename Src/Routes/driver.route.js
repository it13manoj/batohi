const express = require("express");
const { create, getProfile, login, profile, dashboard, status } = require("../controllers/driver.controller");
const authMiddleware = require("../Middleware/auth.middleware");
const { upload } = require("../Utils/upload");


const Route = express.Router();

Route.post("/create", create);
Route.post("/login",login)
Route.post("/profile",authMiddleware, upload.fields([
        {
            name: "profileImage",
            maxCount: 1
        },
        {
            name: "adharImage",
            maxCount: 1
        },
        {
            name: "panCard",
            maxCount: 1
        },
         {
            name: "licenseImage",
            maxCount: 1
        }
    ]), profile),
Route.get("/profile", authMiddleware, getProfile),
Route.get("/dashboard", authMiddleware, dashboard),
Route.post("/:id/status", authMiddleware, status),

module.exports = Route; 
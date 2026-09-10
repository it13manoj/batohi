const express = require("express");
const { create,  profile, getProfile } = require("../controllers/driver.controller");
const { login } = require("../controllers/driver.controller");
const { upload } = require("../Utils/upload");
const authMiddleware = require("../Middleware/auth.middleware");
const Route = express.Router();

Route.post("/create", create);
Route.post("/login", login)
Route.post("/profile", authMiddleware, upload.fields([
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
    ]), profile)
Route.get("/profile", authMiddleware, getProfile)


module.exports = Route;


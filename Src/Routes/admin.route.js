const express = require("express");
const { create, login, dashboard } = require("../controllers/admin.controller");


const Route = express.Router();

Route.post("/create", create);
Route.post ("/login", login);


// Dashboard
Route.get(
    "/dashboard",dashboard
    
);


module.exports = Route
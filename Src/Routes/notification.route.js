const express = require("express");
const { create } = require("../controllers/notification.controller");

const Route = express.Router();

Route.post("/create", create);


module.exports = Route;
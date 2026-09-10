const express = require("express");
const { create } = require("../controllers/agent.controller");
const { login } = require("../controllers/agent.controller");

const Route = express.Router();

Route.post("/create", create);
Route.post("/login",login)


module.exports = Route;

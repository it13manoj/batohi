const express = require("express");
const { create, find } = require("../controllers/role.controller");
const router = express.Router();


router.post("/create", create);
router.get("/find", find);

module.exports = router;
const express = require("express");

const {
    create,
    getAllPayments,
    getPaymentById,
    getPaymentStats,
    getPayments
} = require("../controllers/payment.controller");

const Route = express.Router();


// Create Payment
Route.post("/create", create);


// Get all payments
Route.get("/all", getPayments);


// Get payment statistics
Route.get("/stats", getPaymentStats);


// Get single payment
Route.get("/:id", getPaymentById);``


module.exports = Route;
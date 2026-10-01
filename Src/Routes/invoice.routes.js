const express = require("express");

const router = express.Router();

const {
    createInvoice,
    getAllInvoices,
    getInvoiceById,
    updateInvoice,
    deleteInvoice
} = require("../controllers/invoice.controller");


// Create
router.post("/create", createInvoice);

// Get all
router.get("/all", getAllInvoices);

// Get by ID
router.get("/:id", getInvoiceById);

// Update
router.put("/:id", updateInvoice);

// Delete
router.delete("/:id", deleteInvoice);


module.exports = router;
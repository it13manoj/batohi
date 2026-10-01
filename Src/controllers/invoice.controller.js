const Invoice = require("../Models/invoice");

// ==========================================
// CREATE INVOICE
// ==========================================
exports.createInvoice = async (req, res) => {
    try {
        const {
            invoice_number,
            booking_id,
            booking_number,
            customer_id,
            customer_name,
            customer_email,
            customer_mobile,
            amount,
            tax_amount,
            discount_amount,
            total_amount,
            payment_method,
            payment_status,
            status,
            issue_date,
            due_date
        } = req.body;

        // Required fields check
        if (!invoice_number) {
            return res.status(400).json({
                success: false,
                message: "Invoice number is required"
            });
        }

        if (!customer_name) {
            return res.status(400).json({
                success: false,
                message: "Customer name is required"
            });
        }

        if (amount === undefined || amount === null) {
            return res.status(400).json({
                success: false,
                message: "Amount is required"
            });
        }

        if (total_amount === undefined || total_amount === null) {
            return res.status(400).json({
                success: false,
                message: "Total amount is required"
            });
        }

        // Check invoice number already exists
        const existingInvoice = await Invoice.findOne({
            where: {
                invoice_number
            }
        });

        if (existingInvoice) {
            return res.status(409).json({
                success: false,
                message: "Invoice number already exists"
            });
        }

        // Create invoice
        const invoice = await Invoice.create({
            invoice_number,
            booking_id,
            booking_number,
            customer_id,
            customer_name,
            customer_email,
            customer_mobile,
            amount,
            tax_amount: tax_amount || 0,
            discount_amount: discount_amount || 0,
            total_amount,
            payment_method: payment_method || "UPI",
            payment_status: payment_status || "Pending",
            status: status || "Active",
            issue_date,
            due_date
        });

        return res.status(201).json({
            success: true,
            message: "Invoice created successfully",
            data: invoice
        });

    } catch (error) {
        console.error("Create Invoice Error:", error);

        return res.status(500).json({
            success: false,
            message: "Failed to create invoice",
            error: error.message
        });
    }
};


// ==========================================
// GET ALL INVOICES
// ==========================================
exports.getAllInvoices = async (req, res) => {
    try {
        const invoices = await Invoice.findAll({
            order: [["id", "DESC"]]
        });

        return res.status(200).json({
            success: true,
            message: "Invoices fetched successfully",
            count: invoices.length,
            data: invoices
        });

    } catch (error) {
        console.error("Get All Invoice Error:", error);

        return res.status(500).json({
            success: false,
            message: "Failed to fetch invoices",
            error: error.message
        });
    }
};


// ==========================================
// GET INVOICE BY ID
// ==========================================
exports.getInvoiceById = async (req, res) => {
    try {
        const { id } = req.params;

        const invoice = await Invoice.findByPk(id);

        if (!invoice) {
            return res.status(404).json({
                success: false,
                message: "Invoice not found"
            });
        }

        return res.status(200).json({
            success: true,
            message: "Invoice fetched successfully",
            data: invoice
        });

    } catch (error) {
        console.error("Get Invoice Error:", error);

        return res.status(500).json({
            success: false,
            message: "Failed to fetch invoice",
            error: error.message
        });
    }
};


// ==========================================
// UPDATE INVOICE
// ==========================================
exports.updateInvoice = async (req, res) => {
    try {
        const { id } = req.params;

        const invoice = await Invoice.findByPk(id);

        if (!invoice) {
            return res.status(404).json({
                success: false,
                message: "Invoice not found"
            });
        }

        await invoice.update(req.body);

        return res.status(200).json({
            success: true,
            message: "Invoice updated successfully",
            data: invoice
        });

    } catch (error) {
        console.error("Update Invoice Error:", error);

        return res.status(500).json({
            success: false,
            message: "Failed to update invoice",
            error: error.message
        });
    }
};


// ==========================================
// DELETE INVOICE
// ==========================================
exports.deleteInvoice = async (req, res) => {
    try {
        const { id } = req.params;

        const invoice = await Invoice.findByPk(id);

        if (!invoice) {
            return res.status(404).json({
                success: false,
                message: "Invoice not found"
            });
        }

        await invoice.destroy();

        return res.status(200).json({
            success: true,
            message: "Invoice deleted successfully"
        });

    } catch (error) {
        console.error("Delete Invoice Error:", error);

        return res.status(500).json({
            success: false,
            message: "Failed to delete invoice",
            error: error.message
        });
    }
};
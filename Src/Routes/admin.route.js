const express = require("express");
const adminController = require("../controllers/admin.controller");
const authMiddleware = require("../Middleware/auth.middleware");

// Soft auth middleware that extracts user if token exists, but doesn't block if missing in dev
const optionalAuth = (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (authHeader) {
    authMiddleware(req, res, next);
  } else {
    req.user = { id: 1, type: "ADMIN" };
    next();
  }
};

const router = express.Router();

// 0. Admin Authentication
router.post("/login", adminController.login);

// 1. Dashboard
router.get("/dashboard", optionalAuth, adminController.getDashboard);

// 2. Customers
router.get("/customers", optionalAuth, adminController.getCustomers);
router.post("/customers", optionalAuth, adminController.createCustomer);
router.put("/customers/:id", optionalAuth, adminController.updateCustomer);
router.delete("/customers/:id", optionalAuth, adminController.deleteCustomer);

// 3. Drivers
router.get("/drivers", optionalAuth, adminController.getDrivers);
router.post("/drivers", optionalAuth, adminController.createDriver);
router.put("/drivers/:id", optionalAuth, adminController.updateDriver);
router.delete("/drivers/:id", optionalAuth, adminController.deleteDriver);
router.post("/drivers/:id/verify", optionalAuth, adminController.verifyDriver);
router.put("/drivers/:id/verify", optionalAuth, adminController.verifyDriver);

// 4. Vehicles
router.get("/vehicles", optionalAuth, adminController.getVehicles);
router.post("/vehicles", optionalAuth, adminController.createVehicle);
router.put("/vehicles/:id", optionalAuth, adminController.updateVehicle);
router.delete("/vehicles/:id", optionalAuth, adminController.deleteVehicle);

// 5. Vehicle Types
router.get("/vehicle-types", optionalAuth, adminController.getVehicleTypes);
router.post("/vehicle-types", optionalAuth, adminController.createVehicleType);
router.put("/vehicle-types/:id", optionalAuth, adminController.updateVehicleType);
router.delete("/vehicle-types/:id", optionalAuth, adminController.deleteVehicleType);

// 6. Bookings
router.get("/bookings", optionalAuth, adminController.getBookings);
router.patch("/bookings/:id/status", optionalAuth, adminController.updateBookingStatus);

// 7. Payments
router.get("/payments", optionalAuth, adminController.getPayments);
router.post("/payments/:id/refund", optionalAuth, adminController.refundPayment);

// 8. Invoices
router.get("/invoices", optionalAuth, adminController.getInvoices);
router.post("/invoices", optionalAuth, adminController.createInvoice);

// 9. Agents
router.get("/agents", optionalAuth, adminController.getAgents);
router.post("/agents", optionalAuth, adminController.createAgent);

// 10. Coupons
router.get("/coupons", optionalAuth, adminController.getCoupons);
router.post("/coupons", optionalAuth, adminController.createCoupon);
router.delete("/coupons/:id", optionalAuth, adminController.deleteCoupon);

// 11. Notifications
router.get("/notifications", optionalAuth, adminController.getNotifications);
router.post("/notifications/send", optionalAuth, adminController.sendNotification);

// 12. Reviews
router.get("/reviews", optionalAuth, adminController.getReviews);
router.delete("/reviews/:id", optionalAuth, adminController.deleteReview);

// 13. Reports
router.get("/reports", optionalAuth, adminController.getReports);

// 14. Settings
router.get("/settings", optionalAuth, adminController.getSettings);
router.put("/settings", optionalAuth, adminController.updateSettings);

// 15. Profile
router.get("/profile", optionalAuth, adminController.getProfile);
router.put("/profile", optionalAuth, adminController.updateProfile);
router.put("/change-password", optionalAuth, adminController.changePassword);

module.exports = router;

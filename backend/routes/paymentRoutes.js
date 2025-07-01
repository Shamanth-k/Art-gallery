const express = require("express");
const { processPayment } = require("../controllers/paymentController");
const router = express.Router();

// Payment route to handle the submission
router.post("/buy-ticket", processPayment);

module.exports = router;

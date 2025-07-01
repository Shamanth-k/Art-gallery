const express = require("express");
const router = express.Router();
const { buyTicketController } = require("../controllers/ticketController");
const { cancelTicketController } = require("../controllers/ticketController");
const ticketController = require("../controllers/ticketController");

// Define the route for POST /api/payment/buy-ticket
router.post("/buy-ticket", buyTicketController);
router.post("/cancel-ticket", cancelTicketController);
router.get("/tickets", ticketController.getTicketsByUserId);
router.get("/", ticketController.getTicketsByUserId);
module.exports = router;

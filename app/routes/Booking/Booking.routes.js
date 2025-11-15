const express = require("express");
const router = express.Router();
const authMiddleware = require("../../middlewares/authMiddleware");
const BookingController = require("../../controllers/Booking/Booking.controller");

router.post(
  "/:packageId/purchase",
  authMiddleware,
  BookingController.purchasePackage,
);

module.exports = router;

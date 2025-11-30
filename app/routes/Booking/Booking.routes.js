const express = require("express");
const router = express.Router();
const authMiddleware = require("../../middlewares/authMiddleware");
const BookingController = require("../../controllers/Booking/Booking.controller");

router.post(
  "/:packageId/purchase",
  authMiddleware,
  BookingController.purchasePackage,
);

router.put(
  "/:packageId/cancel",
  authMiddleware,
  BookingController.cancelPurchase,
);

router.put(
  "/:packageId/confirm",
  authMiddleware,
  BookingController.confirmPurchase,
);

router.get(
  "/booked/:packageId",
  authMiddleware,
  BookingController.alreadyBooked,
);

router.get("/data/:packageId",
  authMiddleware,
  BookingController.getBookingData
);

router.get(
  "/user",
  authMiddleware,
  BookingController.getUserBookings,
);

module.exports = router;

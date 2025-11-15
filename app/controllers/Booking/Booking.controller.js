const BookingService = require("../../services/Booking/Booking.service");

class BookingController {
  async purchasePackage(req, res, next) {
    try {
      const { userId } = req.user;
      const { packageId } = req.params;
      const { paymentMethod, milesToUse } = req.body;

      const booking = await BookingService.purchasePackage({
        userId,
        packageId,
        paymentMethod,
        milesToUse,
      });

      res.status(201).json({
        message: "Package purchased successfully!",
        booking,
      });
    } catch (error) {
      next(error);
    }
  }
}

module.exports = new BookingController();

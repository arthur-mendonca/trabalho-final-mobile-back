const BookingService = require("../../services/Booking/Booking.service")

class BookingController {
  async purchasePackage(req, res) {
    try {
      const { id } = req.user;
      const { packageId } = req.params;
      const { paymentMethod, milesToUse } = req.body;

      const booking = await BookingService.purchasePackage({
        userId: id,
        packageId,
        paymentMethod,
        milesToUse,
      });

      res.status(201).json({
        message: "Pacote comprado com sucesso!",
        booking,
      });
    } catch (error) {
      return res.status(error.statusCode || 400).json({ error: error.message });
    }
  }
}

module.exports = new BookingController();

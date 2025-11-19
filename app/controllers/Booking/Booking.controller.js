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

  async cancelPurchase(req, res) {
    try {
      const { id } = req.user;
      const { packageId } = req.params;

      const booking = await BookingService.cancelPurchase({
        userId: id,
        packageId,
      });

      res.status(200).json({
        message: "Pacote cancelado com sucesso!",
        booking,
      });
    } catch (error) {
      return res.status(error.statusCode || 400).json({ error: error.message });
    }
  }

  async confirmPurchase(req, res) {
    try {
      const { id } = req.user;
      const { packageId } = req.params;

      const booking = await BookingService.confirmPurchase({
        userId: id,
        packageId,
      });

      res.status(200).json({
        message: "Pacote confirmado com sucesso!",
        booking,
      });
    } catch (error) {
      return res.status(error.statusCode || 400).json({ error: error.message });
    }
  }
  async alreadyBooked(req, res) {
    try {
      const { id } = req.user;
      const { packageId } = req.params;

      const response = await BookingService.alreadyBooked({
        userId: id,
        packageId,
      });

      res.status(200).json(response)
    } catch (error) {
      return res.status(error.statusCode || 400).json({ error: error.message });
    }
  }

  async getBookingData(req, res) {
    try {
      const { id } = req.user;
      const { packageId } = req.params;

      const response = await BookingService.getBookingData({
        userId: id,
        packageId,
      });

      res.status(200).json(response)
    } catch (error) {
      return res.status(error.statusCode || 400).json({ error: error.message });

    }
  }
}

module.exports = new BookingController();

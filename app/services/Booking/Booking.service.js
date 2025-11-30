const { Op } = require("sequelize");
const Booking = require("../../db/models/booking");
const Package = require("../../db/models/package");
const User = require("../../db/models/user");
const { sequelize } = require("../../db/models/user");
const WalletTransaction = require("../../db/models/wallettransaction");
const AppError = require("../../errors/AppError");
const PackageService = require("../Packages/Package.service");

class BookingService {
  async purchasePackage({
    userId,
    packageId,
    paymentMethod,
    milesToUse = 0,
  }) {
    const t = await sequelize.transaction();
    try {
      const user = await User.findByPk(userId, { transaction: t });
      const travelPackage = await Package.findByPk(packageId, {
        transaction: t,
      });

      if (!user || !travelPackage) {
        throw new AppError(404, "Usuário ou pacote não encontrados.");
      }

      const alreadyBooked = await Booking.findOne({
        where: {
          userId,
          packageId,
        },
        transaction: t,
      });

      if (alreadyBooked) {
        throw new AppError(400, "Usuário já reservou este pacote.");
      }

      if (user && user.role !== "cliente") {
        throw new AppError(403, "Apenas clientes podem compras pacotes.");
      }

      let moneyPaid = 0;
      let milesUsed = 0;
      const packagePrice = parseFloat(travelPackage.basePrice);
      const milesValueToday = await PackageService.getMilesValue()

      if (paymentMethod === "money") {
        moneyPaid = packagePrice;
        if (user.cashBalance < moneyPaid) {
          throw new AppError(400, "Crédito insuficiente em dinheiro.");
        }
      } else if (paymentMethod === "miles") {
        milesUsed = packagePrice * milesValueToday;
        if (user.milesBalance < milesUsed) {
          throw new AppError(400, "Crédito insuficiente em milhas.");
        }
      } else if (paymentMethod === "mixed") {
        milesUsed = parseInt(milesToUse, 10);
        console.log("--------------------------------");
        console.log("milesUsed", milesUsed);
        console.log("typeof milesUsed", typeof milesUsed);
        const remainingMilesCost = packagePrice * milesValueToday - milesUsed;
        moneyPaid = Number(remainingMilesCost) / milesValueToday;
        const parsedMoneyPaid = Number(moneyPaid);

        if (user.milesBalance < milesUsed || user.cashBalance < parsedMoneyPaid) {
          throw new AppError(400, "Crédito insuficiente para pagamento misto.");
        }
      } else {
        throw new AppError(400, "Método de pagamento inválido.");
      }

      // Debitar créditos do usuário
      user.cashBalance = Number(user.cashBalance) - moneyPaid;
      user.milesBalance = parseInt(user.milesBalance, 10) - milesUsed;

      // Anotar milhas ganhas
      const milesEarned = Math.floor(
        (travelPackage.milesToEarn),
      );
      user.milesBalance = Number(user.milesBalance) + milesEarned;

      await user.save({ transaction: t });

      const booking = await Booking.create(
        {
          userId,
          packageId,
          quotedPrice: packagePrice,
          paymentMethod,
          moneyPaid: parseFloat(moneyPaid).toFixed(2),
          milesUsed,
          status: "pending",
          milesEarned,
        },
        { transaction: t },
      );

      // Registrar transação na carteira
      if (parseFloat(moneyPaid).toFixed(2) > 0) {
        await WalletTransaction.create(
          {
            userId,
            bookingId: booking.id,
            type: "purchase",
            currency: "money",
            amount: -parseFloat(moneyPaid).toFixed(2),
            description: `Pagamento por ${travelPackage.name}`,
          },
          { transaction: t },
        );
      }
      if (milesUsed > 0) {
        await WalletTransaction.create(
          {
            userId,
            bookingId: booking.id,
            type: "purchase",
            currency: "miles",
            amount: -milesUsed,
            description: `Milhas usadas no pacote ${travelPackage.name}`,
          },
          { transaction: t },
        );
      }
      if (milesEarned > 0) {
        await WalletTransaction.create(
          {
            userId,
            bookingId: booking.id,
            type: "earning",
            currency: "miles",
            amount: milesEarned,
            description: `Milhas ganhas por ${travelPackage.name}`,
          },
          { transaction: t },
        );
      }

      await t.commit();
      return booking;
    } catch (error) {
      await t.rollback();
      throw new AppError(500, error.message);
    }
  }

  async cancelPurchase({ userId, packageId }) {
    const t = await sequelize.transaction();
    try {
      const booking = await Booking.findOne({
        where: {
          userId,
          packageId,
          status: {
            [Op.in]: ["pending", "confirmed"]
          },
        },
        transaction: t,
      });

      if (!booking) {
        throw new AppError(404, "Reserva não encontrada.");
      }

      const relatedPackage = await Package.findByPk(packageId, {
        transaction: t,
      });

      if (!relatedPackage) {
        throw new AppError(404, "Erro ao buscar pacote relacionado à reserva.");
      }
      const now = new Date();
      const startDate = new Date(relatedPackage.startDate);
      const MS_PER_HOUR = 1000 * 60 * 60;
      const diffMs = startDate.getTime() - now.getTime();

      if (diffMs < 24 * MS_PER_HOUR) {
        throw new AppError(400, "Reservas canceláveis apenas até 24 horas antes do início do pacote.");
      }
      const moneyToRefund = Number.isFinite(Number(booking.moneyPaid)) ?
        Number(booking.moneyPaid) :
        0;
      const milesToRefund = Number.isFinite(Number(booking.milesUsed)) ?
        Number(booking.milesUsed) :
        0;
      const user = await User.findByPk(userId, {
        transaction: t,
      });
      const newCashBalance = Number(user.cashBalance) + moneyToRefund;
      const newMilesBalance = Number(user.milesBalance) + milesToRefund;

      await User.update(
        {
          cashBalance: newCashBalance,
          milesBalance: newMilesBalance,
        },
        {
          where: {
            id: userId,
          },
          transaction: t,
        },
      );
      if (moneyToRefund > 0) {
        await WalletTransaction.create(
          {
            userId,
            bookingId: booking.id,
            type: "refund",
            currency: "money",
            amount: moneyToRefund,
            description: `Estorno por ${relatedPackage.name}`,
          },
          { transaction: t },
        );
      }

      if (milesToRefund > 0) {
        await WalletTransaction.create(
          {
            userId,
            bookingId: booking.id,
            type: "refund",
            currency: "miles",
            amount: milesToRefund,
            description: `Estorno por ${relatedPackage.name}`,
          },
          { transaction: t },
        );
      }

      booking.status = "cancelled";
      await booking.save({ transaction: t });
      await t.commit();
      return booking;
    } catch (error) {
      await t.rollback();
      throw new AppError(500, error.message);
    }
  }

  async confirmPurchase({ userId, packageId }) {
    const t = await sequelize.transaction();
    try {
      const booking = await Booking.findOne({
        where: {
          userId,
          packageId,
          status: "pending",
        },
        transaction: t,
      });

      if (!booking) {
        throw new AppError(
          404,
          "Reserva não encontrada ou já confirmada/cancelada.",
        );
      }

      booking.status = "confirmed";
      await booking.save({ transaction: t });
      await t.commit();
      return booking;
    } catch (error) {
      await t.rollback();
      throw new AppError(500, error.message);
    }
  }

  async alreadyBooked({ userId, packageId }) {
    try {
      const booking = await Booking.findOne({
        where: {
          userId,
          packageId,
        },
      });
      if (booking) {
        return true
      }
      return false;
    } catch (error) {
      throw new AppError(500, error.message);
    }
  }

  async getBookingData({ userId, packageId }) {
    try {
      const booking = await Booking.findOne({
        where: {
          userId,
          packageId,
        },
      });
      if (!booking) {
        throw new AppError(404, "Reserva para este pacote não encontrada.");
      }
      return booking;
    } catch (error) {
      throw new AppError(500, error.message);
    }
  }

  async getUserBookings({ userId }) {
    try {
      const bookings = await Booking.findAll({
        where: {
          userId,
        },
        include: [
          {
            model: Package,
            as: "package",
          }
        ]
      });

      return bookings;
    } catch (error) {
      throw new AppError(500, error.message);
    }
  }
}

module.exports = new BookingService();

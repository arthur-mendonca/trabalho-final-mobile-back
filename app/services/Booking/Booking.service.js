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
        const remainingMilesCost = packagePrice * 100 - milesUsed;
        moneyPaid = remainingMilesCost / 100;
        if (user.milesBalance < milesUsed || user.cashBalance < moneyPaid) {
          throw new AppError(400, "Crédito insuficiente para pagamento misto.");
        }
      } else {
        throw new AppError(400, "Método de pagamento inválido.");
      }

      // Debitar créditos do usuário
      user.cashBalance = parseFloat(user.cashBalance) - moneyPaid;
      user.milesBalance = parseInt(user.milesBalance, 10) - milesUsed;

      // Anotar milhas ganhas
      const milesEarned = Math.floor(
        (travelPackage.milesToEarn),
      );
      user.milesBalance += milesEarned;

      await user.save({ transaction: t });

      const booking = await Booking.create(
        {
          userId,
          packageId,
          quotedPrice: packagePrice,
          paymentMethod,
          moneyPaid,
          milesUsed,
          status: "confirmed",
          milesEarned,
        },
        { transaction: t },
      );

      // Registrar transação na carteira
      if (moneyPaid > 0) {
        await WalletTransaction.create(
          {
            userId,
            type: "purchase",
            currency: "money",
            amount: -moneyPaid,
            description: `Pagamento por ${travelPackage.name}`,
          },
          { transaction: t },
        );
      }
      if (milesUsed > 0) {
        await WalletTransaction.create(
          {
            userId,
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
}

module.exports = new BookingService();

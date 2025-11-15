const {
  User,
  Package,
  Booking,
  WalletTransaction,
} = require("../../db/models");
const { sequelize } = require("../../db/models/user");
const AppError = require("../../errors/AppError");

class BookingService {
  static async purchasePackage({
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
        throw new AppError(404, "User or Package not found");
      }

      let moneyPaid = 0;
      let milesUsed = 0;
      const packagePrice = parseFloat(travelPackage.basePrice);

      if (paymentMethod === "money") {
        moneyPaid = packagePrice;
        if (user.cashBalance < moneyPaid) {
          throw new AppError(400, "Insufficient cash balance");
        }
      } else if (paymentMethod === "miles") {
        milesUsed = packagePrice * 100; // Assuming 1 BRL = 100 miles
        if (user.milesBalance < milesUsed) {
          throw new AppError(400, "Insufficient miles balance");
        }
      } else if (paymentMethod === "mixed") {
        milesUsed = parseInt(milesToUse, 10);
        const remainingMilesCost = packagePrice * 100 - milesUsed;
        moneyPaid = remainingMilesCost / 100;

        if (user.milesBalance < milesUsed || user.cashBalance < moneyPaid) {
          throw new AppError(400, "Insufficient balance for mixed payment");
        }
      } else {
        throw new AppError(400, "Invalid payment method");
      }

      // Debit balances
      user.cashBalance = parseFloat(user.cashBalance) - moneyPaid;
      user.milesBalance = parseInt(user.milesBalance, 10) - milesUsed;

      // Earn miles on money paid
      const milesEarned = Math.floor(
        moneyPaid * (travelPackage.milesToEarn / 10),
      ); // Example: earn 10% of money paid as miles
      user.milesBalance += milesEarned;

      await user.save({ transaction: t });

      // Create booking record
      const booking = await Booking.create(
        {
          userId,
          packageId,
          quotedPrice: packagePrice,
          paymentMethod,
          moneyPaid,
          milesUsed,
          status: "confirmed",
        },
        { transaction: t },
      );

      // Log transactions
      if (moneyPaid > 0) {
        await WalletTransaction.create(
          {
            userId,
            type: "purchase",
            currency: "money",
            amount: -moneyPaid,
            description: `Payment for package ${travelPackage.name}`,
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
            description: `Miles used for package ${travelPackage.name}`,
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
            description: `Miles earned from package ${travelPackage.name}`,
          },
          { transaction: t },
        );
      }

      await t.commit();
      return booking;
    } catch (error) {
      await t.rollback();
      throw error;
    }
  }
}

module.exports = new BookingService();

const Booking = require("../../db/models/booking");
const User = require("../../db/models/user");
const WalletTransaction = require("../../db/models/wallettransaction");
const AppError = require("../../errors/AppError");

class DashboardService {
    async getDashboardData(userId) {
        try {
            const user = await User.findByPk(userId);
            if (!user) {
                throw new AppError(404, "Usuário não encontrado");
            }

            const bookingCounts = await Booking.count({ where: { userId } });
            const cancelledBookings = await Booking.count({ where: { userId, status: "cancelled" } });
            const confirmedBookings = await Booking.count({ where: { userId, status: "confirmed" } });
            const pendingBookings = await Booking.count({ where: { userId, status: "pending" } });

            const totalCashSpent = await WalletTransaction.sum("amount", {
                where: {
                    userId,
                    type: "purchase",
                    currency: "money"
                }
            });
            const totalMilesSpent = await WalletTransaction.sum("amount", {
                where: {
                    userId,
                    type: "purchase",
                    currency: "miles"
                }
            });
            const totalMilesEarned = await WalletTransaction.sum("amount", {
                where: {
                    userId,
                    type: "earning",
                    currency: "miles"
                }
            });
            const totalCashRefunded = await WalletTransaction.sum("amount", {
                where: {
                    userId,
                    type: "refund",
                    currency: "money"
                }
            });
            const totalMilesRefunded = await WalletTransaction.sum("amount", {
                where: {
                    userId,
                    type: "refund",
                    currency: "miles"
                }
            });

            return {
                bookingCounts,
                cancelledBookings,
                confirmedBookings,
                pendingBookings,
                totalCashSpent,
                totalMilesSpent,
                totalMilesEarned,
                totalCashRefunded,
                totalMilesRefunded,
            }
        } catch (error) {
            console.log(error);
            throw new AppError(error.statusCode || 500, error.message);
        }
    }
}

module.exports = new DashboardService();
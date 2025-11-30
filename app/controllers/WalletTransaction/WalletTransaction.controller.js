const WalletTransactionService = require("../../services/WalletTransaction/WalletTransaction.service")

class WalletTransactionController {
    async create(req, res) {
        try {
            const { id: userId } = req.user;
            const { amount, type, currency, description, bookingId } = req.body;
            const walletTransaction = await WalletTransactionService.create({
                userId,
                amount,
                type,
                currency,
                description,
                bookingId,
            });
            return res.status(201).json(walletTransaction);
        } catch (error) {
            return res.status(error.statusCode || 500).json({ error: error.message });
        }
    }

    async index(req, res) {
        try {
            const { id: userId, role } = req.user;
            const transactions = await WalletTransactionService.findAllByUser(userId, role);
            return res.status(200).json(transactions);
        } catch (error) {
            return res.status(error.statusCode || 500).json({ error: error.message });
        }
    }

    async grantDailyLoginBonus(req, res) {
        try {
            const { id: userId, role } = req.user;
            const tx = await WalletTransactionService.grantDailyLoginBonus({ userId, role });
            return res.status(201).json(tx);
        } catch (error) {
            return res.status(error.statusCode || 500).json({ error: error.message });
        }
    }
}
module.exports = new WalletTransactionController();

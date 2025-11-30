const WalletTransaction = require("../../db/models/wallettransaction");
const User = require("../../db/models/user");
const { sequelize } = require("../../db/models/user");
const AppError = require("../../errors/AppError");
const { Op } = require("sequelize");

class WalletTransactionService {
    async create({ userId, amount, type, currency, description, bookingId }) {
        const allowedTypes = ["deposit", "purchase", "earning", "refund"];
        const allowedCurrencies = ["money", "miles"];

        if (!allowedTypes.includes(type)) {
            throw new AppError(400, "Tipo de transação inválido.");
        }
        if (!allowedCurrencies.includes(currency)) {
            throw new AppError(400, "Moeda inválida. Use 'money' ou 'miles'.");
        }

        const value = Number(amount);
        if (!Number.isFinite(value) || value <= 0) {
            throw new AppError(400, "Valor da transação deve ser numérico e positivo.");
        }

        // Sinal do valor conforme o tipo
        const signedAmount = type === "purchase" ? -value : value;

        const t = await sequelize.transaction();
        try {
            const user = await User.findByPk(userId, { transaction: t });
            if (!user) {
                throw new AppError(404, "Usuário não encontrado.");
            }

            let newCashBalance = Number(user.cashBalance);
            let newMilesBalance = parseInt(user.milesBalance, 10);

            if (currency === "money") {
                if (signedAmount < 0 && newCashBalance < Math.abs(signedAmount)) {
                    throw new AppError(400, "Crédito insuficiente em dinheiro.");
                }
                newCashBalance = Math.round((newCashBalance + signedAmount) * 100) / 100;
            } else if (currency === "miles") {
                if (signedAmount < 0 && newMilesBalance < Math.abs(signedAmount)) {
                    throw new AppError(400, "Crédito insuficiente em milhas.");
                }
                newMilesBalance = newMilesBalance + signedAmount;
            }

            await User.update(
                {
                    cashBalance: newCashBalance,
                    milesBalance: newMilesBalance,
                },
                { where: { id: userId }, transaction: t },
            );

            const walletTransaction = await WalletTransaction.create(
                {
                    userId,
                    bookingId: bookingId || null,
                    type,
                    currency,
                    amount: signedAmount,
                    description:
                        description ||
                        `${type} ${currency === "money" ? "(R$)" : "(milhas)"} no valor de ${value}`,
                },
                { transaction: t },
            );

            await t.commit();
            return walletTransaction;
        } catch (error) {
            await t.rollback();
            throw new AppError(error.statusCode || 500, error.message);
        }
    }

    async findAllByUser(userId, role) {
        if (role === "agente") {
            throw new AppError(403, "Somente clientes têm transações na carteira.");
        }
        return WalletTransaction.findAll({
            where: { userId },
            order: [["createdAt", "DESC"]],
        });
    }

    async grantDailyLoginBonus({ userId, role }) {
        if (role === "agente") {
            throw new AppError(403, "Somente clientes recebem bônus diário.");
        }
        const now = new Date();
        const base = 1000;
        const variation = (now.getUTCDate() + now.getUTCDay() + (now.getUTCMonth() + 1)) % 11;
        const bonusMiles = base + variation;

        const start = new Date(now);
        start.setUTCHours(0, 0, 0, 0);
        const next = new Date(now);
        next.setUTCHours(24, 0, 0, 0);

        const t = await sequelize.transaction();
        try {
            const alreadyGiven = await WalletTransaction.findOne({
                where: {
                    userId,
                    type: "earning",
                    currency: "miles",
                    description: "Bônus de login diário",
                    createdAt: { [Op.gte]: start, [Op.lt]: next },
                },
                transaction: t,
            });
            if (alreadyGiven) {
                throw new AppError(400, "Bônus de login diário já concedido hoje.");
            }

            const user = await User.findByPk(userId, { transaction: t });
            if (!user) {
                throw new AppError(404, "Usuário não encontrado.");
            }

            const newMilesBalance = parseInt(user.milesBalance, 10) + bonusMiles;
            await User.update(
                { milesBalance: newMilesBalance },
                { where: { id: userId }, transaction: t },
            );

            const walletTransaction = await WalletTransaction.create(
                {
                    userId,
                    bookingId: null,
                    type: "earning",
                    currency: "miles",
                    amount: bonusMiles,
                    description: "Bônus de login diário",
                },
                { transaction: t },
            );

            await t.commit();
            return walletTransaction;
        } catch (error) {
            await t.rollback();
            throw new AppError(error.statusCode || 500, error.message);
        }
    }
}
module.exports = new WalletTransactionService();

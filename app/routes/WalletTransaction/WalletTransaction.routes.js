const { Router } = require("express");
const routes = Router();

const authMiddleware = require("../../../app/middlewares/authMiddleware");
const WalletTransactionController = require("../../../app/controllers/WalletTransaction/WalletTransaction.controller");

routes.use(authMiddleware);
routes.get("/", WalletTransactionController.index);
routes.post("/", WalletTransactionController.create);
routes.post("/bonus/daily", WalletTransactionController.grantDailyLoginBonus);

module.exports = routes;

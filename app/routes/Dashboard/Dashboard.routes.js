const { Router } = require("express");
const authMiddleware = require("../../middlewares/authMiddleware");
const DashboardController = require("../../controllers/Dashboard/Dashboard.controller")
const routes = Router();

routes.get("/data", authMiddleware, DashboardController.getDashboardData);

module.exports = routes;

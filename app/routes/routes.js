const { Router } = require("express");
const routes = Router();

const UserRoutes = require("./User/User.routes");
const AuthRoutes = require("./Auth/auth.routes");
const PackageRoutes = require("./Packages/Package.routes");
const BookingRoutes = require("./Booking/Booking.routes");
const DashboardRoutes = require("./Dashboard/Dashboard.routes");
const WalletRoutes = require("./WalletTransaction/WalletTransaction.routes");

routes.use("/user", UserRoutes);
routes.use("/auth", AuthRoutes);
routes.use("/packages", PackageRoutes);
routes.use("/bookings", BookingRoutes);
routes.use("/dashboard", DashboardRoutes);
routes.use("/wallet", WalletRoutes);

module.exports = routes;
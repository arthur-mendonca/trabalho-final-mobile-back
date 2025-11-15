const { Router } = require("express");
const routes = Router();

const UserRoutes = require("./User/User.routes");
const AuthRoutes = require("./Auth/auth.routes");
const PackageRoutes = require("./Packages/Package.routes");
const BookingRoutes = require("./Booking/Booking.routes");

routes.use("/user", UserRoutes);
routes.use("/auth", AuthRoutes);
routes.use("/packages", PackageRoutes);
routes.use("/bookings", BookingRoutes);

module.exports = routes;

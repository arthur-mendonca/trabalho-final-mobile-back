const { Router } = require("express");
const routes = Router();

const UserRoutes = require("./User/User.routes");
const AuthRoutes = require("./Auth/auth.routes");

routes.use("/user", UserRoutes);
routes.use("/auth", AuthRoutes);

module.exports = routes;

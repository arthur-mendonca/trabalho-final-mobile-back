const { Router } = require("express");
const routes = Router();

const UserController = require("../../controllers/User/User.controller");
const authMiddleware = require("../../middlewares/authMiddleware");

routes.post("/register", UserController.register);

routes.get("/me", authMiddleware, UserController.me);

routes.put("/update", authMiddleware, UserController.update);

module.exports = routes;

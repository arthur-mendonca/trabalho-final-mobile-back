const { Router } = require("express");
const routes = Router();

const UserController = require("../../controllers/User/User.controller");
const authMiddleware = require("../../middlewares/authMiddleware");

routes.post("/register", UserController.register);

routes.get("/me", authMiddleware, UserController.me);

routes.get("/:email", UserController.getUserByEmail);

routes.put("/update", authMiddleware, UserController.update);

routes.delete("/delete", authMiddleware, UserController.delete);

module.exports = routes;

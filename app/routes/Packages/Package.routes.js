const { Router } = require("express");
const authMiddleware = require("../../middlewares/authMiddleware");
const PackageController = require("../../controllers/Packages/Package.controller")

const routes = Router();


routes.get("/", authMiddleware, PackageController.getAll);
routes.get("/:id", authMiddleware, PackageController.getById);


routes.post("/", authMiddleware, PackageController.create);
routes.put("/:id", authMiddleware, PackageController.update);
routes.delete("/:id", authMiddleware, PackageController.delete);

// VALOR DIÁRIO DA MILHA
routes.get("/miles/value", PackageController.getMilesValue);

module.exports = routes;

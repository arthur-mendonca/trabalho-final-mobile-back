const { Router } = require("express");
const PackageController = require("../../controllers/Packages/Package.controller");
const authMiddleware = require("../../middlewares/authMiddleware");

const routes = Router();

// Rotas públicas (listar e visualizar pacotes)
routes.get("/", PackageController.getAll);
routes.get("/:id", PackageController.getById);

// Rotas protegidas (criar, atualizar e deletar pacotes)
routes.post("/", authMiddleware, PackageController.create);
routes.put("/:id", authMiddleware, PackageController.update);
routes.delete("/:id", authMiddleware, PackageController.delete);

module.exports = routes;

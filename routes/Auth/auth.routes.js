const { Router } = require("express");
const passport = require("passport");
const AuthController = require("../../controllers/Auth/Auth.controller");
const authMiddleware = require("../../middlewares/authMiddleware");
const routes = Router();

routes.post("/login", AuthController.login);
routes.post("/refresh", AuthController.refresh);
routes.post("/logout", authMiddleware, AuthController.logout);
// Início do fluxo OAuth com GitHub
routes.get(
  "/github",
  passport.authenticate("github", { session: false, scope: ["user:email"] }),
);

// Callback do GitHub
routes.get(
  "/github/callback",
  passport.authenticate("github", { session: false, failureRedirect: "/auth/github/failure" }),
  AuthController.githubCallback,
);

// Falha no OAuth
routes.get("/github/failure", (_req, res) => {
  return res.status(401).json({ error: "GitHub OAuth falhou" });
});

module.exports = routes;
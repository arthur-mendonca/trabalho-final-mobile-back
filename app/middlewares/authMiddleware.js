const { verifyAccessToken, verifyRefreshToken } = require("../../app/utils/tokens");
const User = require("../db/models/user");
const AuthService = require("../services/Auth/Auth.service");

function getCookie(req, name) {
  try {
    const header = req.headers && req.headers["cookie"];
    if (!header) return undefined;
    const parts = header.split(";").map((p) => p.trim());
    for (const part of parts) {
      const idx = part.indexOf("=");
      if (idx === -1) continue;
      const key = part.substring(0, idx);
      const val = part.substring(idx + 1);
      if (key === name) return decodeURIComponent(val);
    }
    return undefined;
  } catch (_) {
    return undefined;
  }
}

module.exports = async function authMiddleware(req, res, next) {
  try {
    const authHeader =
      req.headers["authorization"] || req.headers["Authorization"];
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({ error: "Token ausente" });
    }

    const token = authHeader.substring(7);
    const decoded = verifyAccessToken(token);

    const user = await User.findByPk(decoded.id);
    if (!user) {
      return res.status(401).json({ error: "Usuário não encontrado" });
    }

    req.user = {
      id: user.id,
      email: user.email,
      username: user.username,
      role: user.role,
      cashBalance: parseFloat(user.cashBalance),
      milesBalance: user.milesBalance,
    };
    next();
  } catch (error) {
    // Tentativa de refresh automático quando access token expira
    if (error && error.name === "TokenExpiredError") {
      try {
        const refreshHeader =
          req.get("x-refresh-token") ||
          (req.query && req.query.refreshToken) ||
          (req.body && req.body.refreshToken) ||
          getCookie(req, "refresh_token");

        if (!refreshHeader) {
          return res.status(401).json({ error: "Sessão expirada. Faça login novamente." });
        }

        const { accessToken: newAccessToken, refreshToken: newRefreshToken } =
          await AuthService.refresh({ refreshToken: refreshHeader });
        // Exponha novos tokens para o cliente atualizar seu armazenamento
        res.setHeader("X-Access-Token", newAccessToken);
        res.setHeader("X-Refresh-Token", newRefreshToken);

        // Evita falha ao verificar novamente; usa o refresh token para obter o id do usuário
        const refDecoded = verifyRefreshToken(refreshHeader);
        const user = await User.findByPk(refDecoded.id);

        if (!user) {
          return res.status(401).json({ error: "Usuário não encontrado" });
        }
        req.user = {
          id: user.id,
          email: user.email,
          username: user.username,
          role: user.role,
        };
        return next();
      } catch (_refreshErr) {
        return res.status(401).json({ error: "Sessão expirada. Faça login novamente 2." });
      }
    }
    return res.status(401).json({ error: "Token inválido ou expirado" });
  }
};

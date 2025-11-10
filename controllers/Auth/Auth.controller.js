const AuthService = require("../../services/Auth/Auth.service");

class AuthController {
    async githubCallback(req, res) {
        try {
            const user = req.user;
            if (!user) {
                return res.status(401).json({ error: "GitHub OAuth falhou" });
            }
            const response = await AuthService.issueTokensForUser(user);
            return res.status(200).json(response);
        } catch (error) {
            return res.status(500).json({ error: error.message });
        }
    }

    async login(req, res) {
        try {
            const { email, password } = req.body;
            const response = await AuthService.login({ email, password });
            return res.status(200).json(response);
        } catch (error) {
            const msg = String(error.message || "").toLowerCase();
            if (msg.includes("credenciais inválidas")) {
                return res.status(401).json({ error: "Credenciais inválidas" });
            }
            return res.status(500).json({ error: error.message });
        }
    }

    async refresh(req, res) {
        try {
            const { refreshToken } = req.body;
            if (!refreshToken) {
                return res.status(400).json({ error: "refreshToken é obrigatório" });
            }
            const response = await AuthService.refresh({ refreshToken });
            return res.status(200).json(response);
        } catch (error) {
            const msg = String(error.message || "").toLowerCase();
            if (msg.includes("refresh token inválido")) {
                return res.status(401).json({ error: "Refresh token inválido" });
            }
            return res
                .status(401)
                .json({ error: "Refresh token inválido ou expirado" });
        }
    }

    async logout(req, res) {
        try {
            const userId = req.user?.id;
            if (!userId) {
                return res.status(401).json({ error: "Não autenticado" });
            }
            await AuthService.logout({ userId });
            return res.status(200).json({ message: "Logout realizado" });
        } catch (error) {
            const msg = String(error.message || "").toLowerCase();
            if (msg.includes("usuário não encontrado")) {
                return res.status(404).json({ error: "Usuário não encontrado" });
            }
            return res.status(500).json({ error: error.message });
        }
    }
}

module.exports = new AuthController();
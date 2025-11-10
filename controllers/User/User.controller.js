const UserService = require("../../services/User.service");

class UsersController {
    async register(req, res) {
        try {
            const {
                username,
                email,
                password,
                githubId,
                role
            } = req.body;

            const response = await UserService.register({
                username,
                email,
                password,
                githubId,
                role
            })

            return res.status(201).json(response);
        } catch (error) {
            return res.status(500).json({ error: error.message });
        }
    }

    async login(req, res) {
        try {
            const { email, password } = req.body;
            const response = await UserService.login({ email, password });
            return res.status(200).json(response);
        } catch (error) {
            const msg = String(error.message || '').toLowerCase();
            if (msg.includes('credenciais inválidas')) {
                return res.status(401).json({ error: 'Credenciais inválidas' });
            }
            return res.status(500).json({ error: error.message });
        }
    }

    async refresh(req, res) {
        try {
            const { refreshToken } = req.body;
            if (!refreshToken) {
                return res.status(400).json({ error: 'refreshToken é obrigatório' });
            }
            const response = await UserService.refresh({ refreshToken });
            return res.status(200).json(response);
        } catch (error) {
            const msg = String(error.message || '').toLowerCase();
            if (msg.includes('refresh token inválido')) {
                return res.status(401).json({ error: 'Refresh token inválido' });
            }
            return res.status(401).json({ error: 'Refresh token inválido ou expirado' });
        }
    }

    async logout(req, res) {
        try {
            const userId = req.user?.id;
            if (!userId) {
                return res.status(401).json({ error: 'Não autenticado' });
            }
            await UserService.logout({ userId });
            return res.status(200).json({ message: 'Logout realizado' });
        } catch (error) {
            const msg = String(error.message || '').toLowerCase();
            if (msg.includes('usuário não encontrado')) {
                return res.status(404).json({ error: 'Usuário não encontrado' });
            }
            return res.status(500).json({ error: error.message });
        }
    }

    async me(req, res) {
        return res.status(200).json({ user: req.user });
    }
}

module.exports = new UsersController();
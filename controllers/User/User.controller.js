const UserService = require("../../services/User.service");
const passport = require('passport');
const jwt = require('jsonwebtoken');

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

    async login(req, res, next) {
        return passport.authenticate('local', { session: false }, (err, user, info) => {
            if (err) {
                return res.status(500).json({ error: err.message });
            }
            if (!user) {
                const message = info?.message || 'Credenciais inválidas';
                return res.status(401).json({ error: message });
            }

            try {
                const payload = {
                    id: user.id,
                    email: user.email,
                    username: user.username,
                    role: user.role,
                };

                const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '7d' });

                return res.status(200).json({ user: payload, token });
            } catch (error) {
                return res.status(500).json({ error: error.message });
            }
        })(req, res, next);
    }
}

module.exports = new UsersController();
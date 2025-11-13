const User = require("../../db/models/user");
const crypto = require("crypto");
const bcrypt = require("bcryptjs");
const {
    signAccessToken,
    signRefreshToken,
    verifyRefreshToken,
} = require("../../../app/utils/tokens");


class AuthService {
    async upsertGithubUser({ githubId, username, email }) {
        try {
            let user = await User.findOne({ where: { githubId } });
            if (user) return user;

            const existingByEmail = await User.findOne({ where: { email } });
            if (existingByEmail) {
                await existingByEmail.update({ githubId });
                return existingByEmail;
            }

            const randomPassword = crypto.randomBytes(32).toString("hex");
            user = await User.create({
                username,
                email,
                password: randomPassword,
                githubId,
                role: "cliente",
            });
            return user;
        } catch (error) {
            throw new Error(error.message);
        }
    }

    async login({ email, password }) {
        try {
            const user = await User.findOne({ where: { email } });
            if (!user) {
                throw new Error("Credenciais inválidas");
            }

            const ok = await bcrypt.compare(password, user.password);
            if (!ok) {
                throw new Error("Credenciais inválidas");
            }
            const accessToken = signAccessToken(user);
            const refreshToken = signRefreshToken(user);
            const refreshTokenHash = await bcrypt.hash(refreshToken, 10);
            await user.update({ refreshToken: refreshTokenHash });

            return { accessToken, refreshToken };
        } catch (error) {
            throw new Error(error.message);
        }
    }

    async refresh({ refreshToken }) {
        try {
            const decoded = verifyRefreshToken(refreshToken);
            const user = await User.findByPk(decoded.id);
            if (!user) {
                throw new Error("Refresh token inválido");
            }
            const tokenMatches = await bcrypt.compare(refreshToken, user.refreshToken || "");
            if (!tokenMatches) {
                throw new Error("Refresh token inválido");
            }
            const newAccessToken = signAccessToken(user);
            const newRefreshToken = signRefreshToken(user);
            const newRefreshTokenHash = await bcrypt.hash(newRefreshToken, 10);
            await user.update({ refreshToken: newRefreshTokenHash });

            return { accessToken: newAccessToken, refreshToken: newRefreshToken };
        } catch (error) {
            throw new Error(error.message);
        }
    }

    async logout({ userId }) {
        try {
            const user = await User.findByPk(userId);
            if (!user) {
                throw new Error("Usuário não encontrado");
            }
            await user.update({ refreshToken: null });
            return true;
        } catch (error) {
            throw new Error(error.message);
        }
    }

    async issueTokensForUser(user) {
        try {
            const accessToken = signAccessToken(user);
            const refreshToken = signRefreshToken(user);
            const refreshTokenHash = await bcrypt.hash(refreshToken, 10);
            await user.update({ refreshToken: refreshTokenHash });
            const payload = {
                id: user.id,
                email: user.email,
                username: user.username,
                role: user.role,
            };
            return { user: payload, accessToken, refreshToken };
        } catch (error) {
            throw new Error(error.message);
        }
    }
}

module.exports = new AuthService();
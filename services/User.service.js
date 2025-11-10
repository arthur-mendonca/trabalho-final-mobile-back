const User = require("../db/models/user");
const bcrypt = require("bcryptjs");
const {
  signAccessToken,
  signRefreshToken,
  verifyRefreshToken,
} = require("../utils/tokens");

class UserService {
  async register({
    username,
    email,
    password,
    githubId = null,
    role = "cliente",
  }) {
    try {
      const user = await User.create({
        username,
        email,
        password,
        githubId,
        role,
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
      await user.update({ refreshToken });

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

  async refresh({ refreshToken }) {
    try {
      const decoded = verifyRefreshToken(refreshToken);
      const user = await User.findByPk(decoded.id);
      if (!user || user.refreshToken !== refreshToken) {
        throw new Error("Refresh token inválido");
      }
      const newAccessToken = signAccessToken(user);
      const newRefreshToken = signRefreshToken(user);
      await user.update({ refreshToken: newRefreshToken });

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
}

module.exports = new UserService();

const User = require("../../db/models/user");
const validations = require("../../utils/validations");
const AppError = require("../../errors/AppError");

class UserService {
  async register({
    username,
    email,
    password,
    githubId = null,
    role = "cliente",
  }) {
    try {
      const isEmailValid = await validations.isEmailValid(email);
      if (!isEmailValid) {
        throw new Error("Email inválido");
      }

      const sameEmail = await this.getUserByEmail({ email });
      if (sameEmail) {
        throw new Error("Email já cadastrado");
      }

      const user = await User.create({
        username,
        email,
        password,
        githubId,
        role,
      });

      const parsedUser = user.toJSON();
      delete parsedUser.password;
      delete parsedUser.refreshToken;

      return parsedUser;
    } catch (error) {
      throw new Error(error.message);
    }
  }

  async getUserByEmail({ email }) {
    try {
      const user = await User.findOne({
        where: {
          email,
        },
      });

      if (!user) {
        return false;
      }
      return true;
    } catch (error) {
      throw new Error(error.message);
    }
  }

  async update({ id, username, email, password, cashBalance, milesBalance }) {
    try {
      const user = await User.findByPk(id);
      if (!user) {
        throw new Error("Usuário não encontrado");
      }
      await user.update({
        username,
        email,
        password,
        cashBalance,
        milesBalance,
      });

      if (email) {
        const isEmailValid = await validations.isEmailValid(email);
        if (!isEmailValid) {
          throw new AppError(400, "Ema  il inválido");
        }
      }

      const sameEmail = await this.getUserByEmail({ email });
      if (sameEmail && user.email !== email) {
        throw new AppError(409, "Email já cadastrado");
      }

      if (cashBalance && cashBalance < 0) {
        throw new AppError(400, "Saldo em dinheiro não pode ser negativo");
      }

      if (milesBalance && milesBalance < 0) {
        throw new AppError(400, "Saldo em milhas não pode ser negativo");
      }

      const userObj = user.get({ plain: true });
      delete userObj.password;
      delete userObj.refreshToken;
      return userObj;
    } catch (error) {
      throw new Error(error.message);
    }
  }

  async delete({ id }) {
    try {
      const user = await User.findByPk(id);
      if (!user) {
        throw new Error("Usuário não encontrado");
      }
      await user.destroy();
    } catch (error) {
      throw new Error(error.message);
    }
  }
}

module.exports = new UserService();

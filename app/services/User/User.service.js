const User = require("../../db/models/user");


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

  async update({
    id,
    username,
    email,
    password,
    cashBalance,
    milesBalance
  }) {
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

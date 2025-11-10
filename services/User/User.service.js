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
      return user;
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

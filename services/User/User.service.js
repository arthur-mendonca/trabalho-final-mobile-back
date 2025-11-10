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
}

module.exports = new UserService();

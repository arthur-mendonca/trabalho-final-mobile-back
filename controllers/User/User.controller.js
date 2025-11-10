const UserService = require("../../services/User/User.service");

class UsersController {
  async register(req, res) {
    try {
      const { username, email, password, githubId, role } = req.body;

      const response = await UserService.register({
        username,
        email,
        password,
        githubId,
        role,
      });

      return res.status(201).json(response);
    } catch (error) {
      return res.status(500).json({ error: error.message });
    }
  }

  async me(req, res) {
    return res.status(200).json({ user: req.user });
  }

  async update(req, res) {
    try {
      const { username, email, password } = req.body;
      const response = await UserService.update({
        id: req.user.id,
        username,
        email,
        password,
      });
      return res.status(200).json(response);
    } catch (error) {
      return res.status(500).json({ error: error.message });
    }
  }
}

module.exports = new UsersController();

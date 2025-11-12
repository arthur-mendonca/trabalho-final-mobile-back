const UserService = require("../../services/User/User.service");

class UsersController {
  async register(req, res) {
    try {
      const { username, email, password, role } = req.body;

      const response = await UserService.register({
        username,
        email,
        password,
        role,
      });

      return res.status(201).json(response);
    } catch (error) {
      return res.status(500).json({ error: error.message });
    }
  }

  async me(req, res) {
    return res.status(200).json(req.user);
  }

  async getUserByEmail(req, res) {
    try {
      const { email } = req.params;

      const response = await UserService.getUserByEmail({ email });

      return res.status(200).json(response);
    } catch (error) {
      return res.status(500).json({ error: error.message });
    }
  }

  async update(req, res) {
    try {
      const {
        username,
        email,
        password,
        cashBalance,
        milesBalance
      } = req.body;

      const response = await UserService.update({
        id: req.user.id,
        username,
        email,
        password,
        cashBalance,
        milesBalance,
      });
      return res.status(200).json(response);
    } catch (error) {
      return res.status(500).json({ error: error.message });
    }
  }

  async delete(req, res) {
    try {
      await UserService.delete({ id: req.user.id });
      return res.status(204).json();
    } catch (error) {
      return res.status(500).json({ error: error.message });
    }
  }
}

module.exports = new UsersController();

const DashboardService = require("../../services/Dashboard/Dashboard.service");

class DashboardController {
    async getDashboardData(req, res) {
        try {
            const userId = req.user.id;
            console.log(userId);
            const response = await DashboardService.getDashboardData(userId);
            return res.status(200).json(response);
        } catch (error) {
            return res.status(error.statusCode || 500).json({ message: error.message });
        }
    }
}

module.exports = new DashboardController();
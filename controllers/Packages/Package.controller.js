const PackageService = require("../../services/Packages/Package.service");

class PackageController {
  async create(req, res) {
    try {
      const packageData = req.body;
      const newPackage = await PackageService.create(packageData);
      return res.status(201).json(newPackage);
    } catch (error) {
      return res.status(400).json({ error: error.message });
    }
  }

  async getAll(req, res) {
    try {
      const { destination, minPrice, maxPrice, startDate, endDate } = req.query;
      const packages = await PackageService.getAll({
        destination,
        minPrice,
        maxPrice,
        startDate,
        endDate,
      });
      return res.status(200).json(packages);
    } catch (error) {
      return res.status(400).json({ error: error.message });
    }
  }

  async getById(req, res) {
    try {
      const { id } = req.params;
      const packageFound = await PackageService.getById(id);
      return res.status(200).json(packageFound);
    } catch (error) {
      return res.status(404).json({ error: error.message });
    }
  }

  async update(req, res) {
    try {
      const { id } = req.params;
      const packageData = req.body;
      const updatedPackage = await PackageService.update(id, packageData);
      return res.status(200).json(updatedPackage);
    } catch (error) {
      return res.status(400).json({ error: error.message });
    }
  }

  async delete(req, res) {
    try {
      const { id } = req.params;
      const result = await PackageService.delete(id);
      return res.status(200).json(result);
    } catch (error) {
      return res.status(404).json({ error: error.message });
    }
  }

  async getMilesValue(_req, res) {
    try {
      const milesValue = await PackageService.getMilesValue();
      return res.status(200).json(milesValue);
    } catch (error) {
      return res.status(400).json({ error: error.message });
    }
  }
}

module.exports = new PackageController();

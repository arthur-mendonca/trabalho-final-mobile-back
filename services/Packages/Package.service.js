const Package = require("../../db/models/package");
const { Op } = require("sequelize");

class PackageService {
  async create(packageData) {
    try {
      const newPackage = await Package.create(packageData);
      return newPackage;
    } catch (error) {
      throw new Error(error.message);
    }
  }

  async getAll({ destination, minPrice, maxPrice, startDate, endDate } = {}) {
    try {
      const where = {};

      if (destination) {
        where.destination = { [Op.iLike]: `%${destination}%` };
      }

      if (minPrice || maxPrice) {
        where.basePrice = {};
        if (minPrice) where.basePrice[Op.gte] = minPrice;
        if (maxPrice) where.basePrice[Op.lte] = maxPrice;
      }

      if (startDate || endDate) {
        where.startDate = {};
        if (startDate) where.startDate[Op.gte] = new Date(startDate);
        if (endDate) where.startDate[Op.lte] = new Date(endDate);
      }

      const packages = await Package.findAll({
        where,
        order: [["startDate", "ASC"]],
      });

      return packages;
    } catch (error) {
      throw new Error(error.message);
    }
  }

  async getById(id) {
    try {
      const packageFound = await Package.findByPk(id);
      if (!packageFound) {
        throw new Error("Pacote não encontrado");
      }
      return packageFound;
    } catch (error) {
      throw new Error(error.message);
    }
  }

  async update(id, packageData) {
    try {
      const packageFound = await Package.findByPk(id);
      if (!packageFound) {
        throw new Error("Pacote não encontrado");
      }

      await packageFound.update(packageData);
      return packageFound;
    } catch (error) {
      throw new Error(error.message);
    }
  }

  async delete(id) {
    try {
      const packageFound = await Package.findByPk(id);
      if (!packageFound) {
        throw new Error("Pacote não encontrado");
      }

      await packageFound.destroy();
      return { message: "Pacote excluído com sucesso" };
    } catch (error) {
      throw new Error(error.message);
    }
  }
}

module.exports = new PackageService();

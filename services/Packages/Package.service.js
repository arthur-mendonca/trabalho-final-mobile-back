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

  async getMilesValue() {
    try {
      const milesValueStr = process.env.MILES_VALUE;
      const maxVariationStr = process.env.MAX_VARIATION;
      const minVariationStr = process.env.MIN_VARIATION;

      if (!milesValueStr) {
        throw new Error("MILES_VALUE não está configurado");
      }
      if (!maxVariationStr) {
        throw new Error("MAX_VARIATION não está configurado");
      }
      if (!minVariationStr) {
        throw new Error("MIN_VARIATION não está configurado");
      }
      const milesValue = parseFloat(milesValueStr);
      const maxVariation = parseFloat(maxVariationStr);
      const minVariation = parseFloat(minVariationStr);

      if (Number.isNaN(milesValue)) {
        throw new Error("MILES_VALUE inválido");
      }
      if (Number.isNaN(maxVariation)) {
        throw new Error("MAX_VARIATION inválido");
      }
      if (Number.isNaN(minVariation)) {
        throw new Error("MIN_VARIATION inválido");
      }

      const randomized = Math.random() * (maxVariation - minVariation) + minVariation;
      const output = milesValue * (1 + randomized);
      const parsedOutput = Number(output.toFixed(0));
      return parsedOutput;
    } catch (error) {
      console.log(error);
      throw new Error(error.message);
    }
  }
}

module.exports = new PackageService();

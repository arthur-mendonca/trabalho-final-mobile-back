const Package = require("../../db/models/package")
const { Op } = require("sequelize");
const AppError = require("../../errors/AppError");
const ExchangeRateService = require("../api/exchange-rate");

class PackageService {
  async create(packageData, user) {
    const {
      name,
      description,
      destination,
      startDate,
      endDate,
      basePrice,
      transfer,
      hotel,
      tickets
    } = packageData
    try {
      const { role } = user;
      if (role !== "agente") {
        throw new AppError(403, "Apenas agentes podem criar pacotes");
      }
      if (basePrice <= 0) {
        throw new AppError(400, "O preço base deve ser maior que zero");
      }
      const milesValue = basePrice / 2;
      const payload = {
        name,
        description,
        destination,
        startDate,
        endDate,
        basePrice,
        milesToEarn: milesValue,
        transfer,
        hotel,
        tickets,
      }
      const newPackage = await Package.create({
        ...payload,
      });
      return newPackage;
    } catch (error) {
      console.log(error);
      throw new AppError(error.statusCode || 500, error.message);
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

      const formattedPackages = packages.map(async (pack) => {
        const parsedPack = pack.toJSON()
        let milVal = await this.getMilesValue()
        let parsedPrice = parseFloat(parsedPack.basePrice)
        const milesPrice = milVal * parsedPrice

        return {
          ...parsedPack,
          basePrice: parseFloat(parsedPack.basePrice),
          milesPrice: parseFloat(milesPrice.toFixed(0))
        }
      })

      return Promise.all(formattedPackages);
    } catch (error) {
      console.log(error);
      throw new AppError(error.statusCode || 500, error.message);
    }
  }

  async getById(id) {
    try {
      const packageFound = await Package.findByPk(id);
      if (!packageFound) {
        throw new AppError(404, "Pacote não encontrado");
      }
      let parsedPack = packageFound.toJSON()

      let milVal = await this.getMilesValue()
      let parsedPrice = parseFloat(parsedPack.basePrice)
      let milesPrice = milVal * parsedPrice

      const formattedPack = {
        ...parsedPack,
        basePrice: parseFloat(parsedPack.basePrice),
        milesPrice: parseFloat(milesPrice.toFixed(0))
      }
      return formattedPack;
    } catch (error) {
      throw new AppError(error.statusCode || 500, error.message);
    }
  }

  async update(id, packageData) {
    try {
      const packageFound = await Package.findByPk(id);
      if (!packageFound) {
        throw new AppError(404, "Pacote não encontrado");
      }

      if (packageData.basePrice <= 0) {
        throw new AppError(400, "O preço base deve ser maior que zero");
      }

      await packageFound.update(packageData);
      return packageFound;
    } catch (error) {
      throw new AppError(error.statusCode || 500, error.message);
    }
  }

  async delete(id) {
    try {
      const packageFound = await Package.findByPk(id);
      if (!packageFound) {
        throw new AppError(404, "Pacote não encontrado");
      }

      await packageFound.destroy();
      return { message: "Pacote excluído com sucesso" };
    } catch (error) {
      throw new AppError(error.statusCode || 500, error.message);
    }
  }

  async getMilesValue() {
    try {
      const milesValueStr = process.env.MILES_VALUE;
      const maxVariationStr = process.env.MAX_VARIATION;
      const minVariationStr = process.env.MIN_VARIATION;

      if (!milesValueStr) {
        throw new AppError(500, "MILES_VALUE não está configurado");
      }
      if (!maxVariationStr) {
        throw new AppError(500, "MAX_VARIATION não está configurado");
      }
      if (!minVariationStr) {
        throw new AppError(500, "MIN_VARIATION não está configurado");
      }
      const milesValue = parseFloat(milesValueStr);
      const maxVariation = parseFloat(maxVariationStr);
      const minVariation = parseFloat(minVariationStr);

      if (Number.isNaN(milesValue)) {
        throw new AppError(500, "MILES_VALUE inválido");
      }
      if (Number.isNaN(maxVariation)) {
        throw new AppError(500, "MAX_VARIATION inválido");
      }
      if (Number.isNaN(minVariation)) {
        throw new AppError(500, "MIN_VARIATION inválido");
      }

      const exchangeRate = await ExchangeRateService.getExchangeRate();
      const randomized = exchangeRate * (maxVariation - minVariation) + minVariation;
      const output = milesValue * (1 + randomized);
      const parsedOutput = Number(output.toFixed(0));
      return parsedOutput;
    } catch (error) {
      throw new AppError(error.statusCode || 500, error.message);
    }
  }
}

module.exports = new PackageService();

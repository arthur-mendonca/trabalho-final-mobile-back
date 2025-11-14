const { default: axios } = require("axios");
const AppError = require("../../errors/AppError");

class ExchangeRateService {
    constructor() {
        this.apiKey = process.env.EXCHANGE_API_KEY;
        this.url = `https://v6.exchangerate-api.com/v6/${this.apiKey}/latest/USD`
    }

    async getExchangeRate() {
        try {
            const response = await axios.get(this.url);
            return response.data.conversion_rates.BRL;
        } catch (error) {
            console.log(error);
            throw new AppError(error.statusCode || 500, error.message);
        }
    }
}

module.exports = new ExchangeRateService()
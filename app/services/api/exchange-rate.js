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
            console.log("Exchange Rate API Response:", response.data.conversion_rates.BRL);
            return response.data.conversion_rates.BRL;
        } catch (error) {
            console.log(error.message);

            if (error) {
                return 10;
            }

        }
    }
}

module.exports = new ExchangeRateService()
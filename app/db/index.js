const { Sequelize } = require("sequelize");
const config = require("./config/config");
const env = process.env.NODE_ENV || "development";
const cfg = config[env];

const User = require("./models/user");
const Package = require("./models/package");
const Booking = require("./models/booking");
const WalletTransaction = require("./models/wallettransaction");

const models = [
  User,
  Package,
  Booking,
  WalletTransaction
];

class Database {
  constructor() {
    this.init();
  }

  init() {
    let sequelize;
    if (cfg.use_env_variable) {
      sequelize = new Sequelize(process.env[cfg.use_env_variable], cfg);
    } else {
      sequelize = new Sequelize(cfg.database, cfg.username, cfg.password, cfg);
    }

    this.connection = sequelize;
    models.map((model) => model.init(this.connection));
    models.forEach(
      (model) => model.associate && model.associate(this.connection.models),
    );
  }
}

module.exports = new Database();

const express = require("express");
const cors = require("cors");
require("dotenv").config();
const passport = require("passport");
require("./db/index");
require("./utils/passport");
const routes = require("./routes/routes");

class App {
  constructor() {
    this.server = express();
    this.middlewares();
    this.routes();
  }

  middlewares() {
    this.server.use(
      cors({
        origin: "*",
        methods: ["GET", "POST", "PUT", "DELETE"],
        allowedHeaders: ["Content-Type", "Authorization"],
      }),
    );
    this.server.use(express.json());
    this.server.use(passport.initialize());
  }

  routes() {
    this.server.use(routes);
  }
}

module.exports = new App().server;

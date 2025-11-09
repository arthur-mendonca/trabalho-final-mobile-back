const { Router } = require("express");
const routes = Router();

const UserController = require('../../controllers/User/User.controller')

routes.post('/register', UserController.register)
routes.post('/login', UserController.login)

module.exports = routes;
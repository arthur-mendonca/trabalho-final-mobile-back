const { Router } = require("express");
const routes = Router();

const UserController = require('../../controllers/User/User.controller')
const auth = require('../../middlewares/auth');

routes.post('/register', UserController.register)
routes.post('/login', UserController.login)
routes.post('/refresh', UserController.refresh)
routes.post('/logout', auth, UserController.logout)
routes.get('/me', auth, UserController.me)

module.exports = routes;
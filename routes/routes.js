const { Router } = require("express");
const routes = Router();

const UserRoutes = require('./User/User.routes')

routes.use('/user', UserRoutes)

module.exports = routes;
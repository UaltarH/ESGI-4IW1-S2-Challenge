const express = require("express");
const userController = require("../controllers/userController");
const checkRole = require("../middlewares/user/checkRole");

const indexRouter = express.Router();

indexRouter.post("/login", checkRole(),userController.login);
indexRouter.get('/verify/:token', userController.verify);

module.exports = indexRouter;
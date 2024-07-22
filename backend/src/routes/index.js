const express = require("express");
const userController = require("../controllers/userController");

const indexRouter = express.Router();

indexRouter.post("/login", userController.login);
indexRouter.get('/verify/:token', userController.verify);

module.exports = indexRouter;
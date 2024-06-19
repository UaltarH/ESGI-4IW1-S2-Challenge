const express = require("express");
const authController = require("../controllers/authController.js");

const indexRouter = express.Router();
indexRouter.post("/register", authController.register);

module.exports = {
  indexRouter,
};

const express = require("express");
const HelloController = require("../controllers/helloController.js");
// const authController = require("../controllers/authController.js");

const indexRouter = express.Router();
indexRouter.get("/", HelloController.index);


// const authRouter = express.Router();
// // authRouter.post("/register", SecurityController.register);
// authRouter.get("/register", authController.register);
// authRouter.get("/login", authController.login);

module.exports = {
  indexRouter,
};

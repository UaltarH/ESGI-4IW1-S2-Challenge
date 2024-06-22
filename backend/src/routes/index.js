const express = require("express");
const HelloController = require("../controllers/helloController.js");
const SearchController = require("../controllers/SearchController.js");
// const authController = require("../controllers/authController.js");
const authController = require("../controllers/authController.js");

const indexRouter = express.Router();
indexRouter.get("/", HelloController.index);
indexRouter.get("/search/:search", SearchController.index);
indexRouter.get("/article/:id", SearchController.article);

const searchRouter = express.Router();
// searchRouter.get("/product", )


// const authRouter = express.Router();
// // authRouter.post("/register", SecurityController.register);
// authRouter.get("/register", authController.register);
// authRouter.get("/login", authController.login);
indexRouter.post("/register", authController.register);

module.exports = {
  indexRouter,
};

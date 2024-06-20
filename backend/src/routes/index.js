const express = require("express");
const searchController = require("../controllers/searchController.js");
const userController = require("../controllers/userController.js");

const indexRouter = express.Router();
indexRouter.get("/search/:search", searchController.index);
indexRouter.get("/article/:id", searchController.article);

const searchRouter = express.Router();
// searchRouter.get("/product", )

module.exports = {
  indexRouter,
};

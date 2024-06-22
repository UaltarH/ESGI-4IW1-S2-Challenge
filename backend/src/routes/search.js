const express = require("express");
const searchController = require("../controllers/searchController.js");
const { search } = require("./index.js");

const searchRouter = express.Router();
searchRouter.get("/search", searchController.index);
searchRouter.get("/search/:search", searchController.index);
searchRouter.get("/article/:id", searchController.article);
// searchRouter.get("/product", )

module.exports = searchRouter;

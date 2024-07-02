const express = require("express");
const searchController = require("../controllers/searchController.js");
const { search } = require("./index.js");

const searchRouter = express.Router();
searchRouter.get("/search", searchController.getProducts);
searchRouter.get("/search/:search", searchController.getProducts);
// searchRouter.get("/article/:id", searchController.article);
// searchRouter.get("/product", )

module.exports = searchRouter;

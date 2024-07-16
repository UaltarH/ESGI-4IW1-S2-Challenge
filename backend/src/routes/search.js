const express = require("express");
const searchController = require("../controllers/searchController.js");

const searchRouter = express.Router();
searchRouter.get("/search", searchController.getProducts);

module.exports = searchRouter;

const express = require("express");
const CategoryController = require("../controllers/categoryController.js");

const categoryRouter = express.Router();
categoryRouter.get("/categories", CategoryController.getAllCategories);

module.exports = categoryRouter;

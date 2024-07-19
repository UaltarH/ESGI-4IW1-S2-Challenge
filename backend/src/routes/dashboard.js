const express = require("express");
const DashbboardController = require("../controllers/chartController");

const dashboardRouter = express.Router();
dashboardRouter.post("/dashboard", DashbboardController.getDataForChart);

module.exports = dashboardRouter;

const express = require("express");
const DashboardController = require("../controllers/dashboardController");

const dashboardRouter = express.Router();
dashboardRouter.post("/dashboard", DashboardController.createWidget);
dashboardRouter.get("/dashboard", DashboardController.getWidgets);
dashboardRouter.delete("/dashboard/:widgetId", DashboardController.deleteWidget);
dashboardRouter.put("/dashboard", DashboardController.updateWidgets);

module.exports = dashboardRouter;

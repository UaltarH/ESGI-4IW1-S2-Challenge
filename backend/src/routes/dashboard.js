const express = require("express");
const DashboardController = require("../controllers/dashboardController");

const dashboardRouter = express.Router();
dashboardRouter.get("/dashboard", DashboardController.getWidgets);
dashboardRouter.post("/dashboard", DashboardController.createWidget);
dashboardRouter.delete("/dashboard/:widgetId", DashboardController.deleteWidget);
dashboardRouter.put("/dashboard", DashboardController.updateWidgets);

module.exports = dashboardRouter;

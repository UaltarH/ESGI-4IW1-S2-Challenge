const express = require("express");
const DashboardController = require("../controllers/dashboardController");
const checkRole = require("../middlewares/dashboard/checkRole");

const dashboardRouter = express.Router();
dashboardRouter.post("/dashboard", checkRole(), DashboardController.createWidget);
dashboardRouter.get("/dashboard", checkRole(), DashboardController.getWidgets);
dashboardRouter.delete("/dashboard/:widgetId", checkRole(), DashboardController.deleteWidget);
dashboardRouter.put("/dashboard", checkRole(), DashboardController.updateWidgets);

module.exports = dashboardRouter;

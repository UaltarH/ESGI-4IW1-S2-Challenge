const express = require("express");
const NotificationController = require("../controllers/notificationController");

const notificationRouter = express.Router();
notificationRouter.get("/notif/:userId", NotificationController.getNotificationForUser);
notificationRouter.put("/notif/:notifId", NotificationController.updateNotification);
notificationRouter.delete("/notif/:notifId", NotificationController.deleteNotification);

module.exports = notificationRouter;

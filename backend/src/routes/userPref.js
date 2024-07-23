const express = require("express");

const UserPrefController = require("../controllers/userPrefController");

const userPrefRouter = express.Router();
userPrefRouter.get("/userPref/:userId", UserPrefController.getUserPref);
userPrefRouter.put("/userPref/:userId", UserPrefController.updateUserPref);

module.exports = userPrefRouter;
const Router = require("express");
const { LaPosteAPIController } = require("../controllers/laPosteAPIController.js");

const indexRouter = Router();

indexRouter.post("/shipping", LaPosteAPIController.create);
indexRouter.put("/shipping", LaPosteAPIController.update);

module.exports = { indexRouter };

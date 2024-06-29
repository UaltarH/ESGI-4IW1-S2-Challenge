const { Router } = require("express");
require("../middlewares/validate.js");
require("../schema/register.js");
require("../controllers/userController.js");
const {MockController} = require("../controllers/mockController");

const mockRouter = Router();

mockRouter.get("/mock/users", MockController.getUsers);
mockRouter.get("/mock/users/:id", MockController.getUser);
mockRouter.post("/mock/users", MockController.mockCreate);
mockRouter.get("/mock/roles", MockController.mockGetRoles);

module.exports = mockRouter;

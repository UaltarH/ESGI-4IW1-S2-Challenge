const { Router } = require('express');
import authController from '../controllers/authController.js';

const userRouter = Router();

// userRouter.get("/all", SecurityController.getUsers);
// userRouter.get("/byId/:id", SecurityController.getUser);
// userRouter.get("/roles", SecurityController.getRoles);
// userRouter.delete("/delete/:id", SecurityController.deleteUser);

module.exports = userRouter;
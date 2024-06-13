import { Router } from 'express';
import UserController from '../controllers/userController.js';

export const userRouter = Router();

// userRouter.get("/all", SecurityController.getUsers);
// userRouter.get("/byId/:id", SecurityController.getUser);
// userRouter.get("/roles", SecurityController.getRoles);
// userRouter.delete("/delete/:id", SecurityController.deleteUser);
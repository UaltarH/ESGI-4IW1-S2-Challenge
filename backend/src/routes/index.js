import Router from "express";
import { HelloController } from "../controllers/helloController.js";

export const indexRouter = Router();

indexRouter.get("/", HelloController.index);

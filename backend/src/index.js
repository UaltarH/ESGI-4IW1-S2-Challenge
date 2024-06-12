import {authRouter, indexRouter, userRouter} from "./routes/index.js";
import express from "express";
import cors from "cors";

const server = express();
const port = process.env.PORT || 8000;
const corsOptions = {
  origin: "http://localhost:5173",
  optionsSuccessStatus: 200
};
server.use(cors(corsOptions));
server.use(express.json());
server.use("/", indexRouter);
server.use("/user", userRouter);
server.use("/auth", authRouter);


server.listen(port, "0.0.0.0", () => {
  console.log(`Server listening on http://localhost:${port}`);
});

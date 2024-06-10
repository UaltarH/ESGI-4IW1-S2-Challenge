import express from "express";
import { indexRouter } from "./routes/index.js";

const server = express();

server.use("/", indexRouter);

server.listen(8000, "0.0.0.0", () => {
  console.log("Server listening on http://localhost:8000");
});

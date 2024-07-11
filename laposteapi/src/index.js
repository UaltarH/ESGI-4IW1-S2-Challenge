const express = require("express");
const { indexRouter } = require("./routes/index.js");

const server = express();

server.use(express.json());
server.use("/", indexRouter);

server.listen(process.env.PORT, "0.0.0.0", () => {
  console.log(`Server listening on http://localhost:${process.env.PORT}`);
});

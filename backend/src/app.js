const express = require('express');
const cors = require('cors');
const { indexRouter , authRouter, mockRouter} = require('./routes');
const app = express();

const corsOptions = {
  origin: "http://localhost:5173",
  optionsSuccessStatus: 200
};

app.use(express.json()); //body-parser
app.use(cors(corsOptions));

app.use("/", indexRouter);
app.use("/mock", mockRouter);
app.use("/auth", authRouter);
// app.use("/user", userRouter);

module.exports = {app};
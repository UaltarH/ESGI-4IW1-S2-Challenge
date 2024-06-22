
const express = require('express');
const cors = require('cors');
const indexRouter = require('./routes/index');
const searchRouter = require('./routes/search');
const userRouter  = require('./routes/user');
const app = express();

const corsOptions = {
  origin: "http://localhost:5173",
  optionsSuccessStatus: 200
};

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors(corsOptions));

app.use(indexRouter);
app.use(searchRouter);
app.use(userRouter);

module.exports = { app };
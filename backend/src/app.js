
const express = require('express');
const cors = require('cors');
const { indexRouter } = require('./routes');
const { userRouter } = require('./routes/user');
const app = express();

const corsOptions = {
  origin: "http://localhost:5173",
  optionsSuccessStatus: 200
};

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors(corsOptions));

app.use(indexRouter);
app.use('/search', indexRouter);
app.use(userRouter);


module.exports = { app };
const express = require('express');
const cors = require('cors');
const indexRouter = require('./routes/index');
const searchRouter = require('./routes/search');
const userRouter = require('./routes/user');
const productRouter = require('./routes/product');
const orderRouter = require('./routes/order');
const cartRouter = require('./routes/cart');
const mockRouter = require("./routes/mock");
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
app.use(productRouter);
app.use(orderRouter);
app.use(cartRouter);
app.use(mockRouter);

module.exports = { app };
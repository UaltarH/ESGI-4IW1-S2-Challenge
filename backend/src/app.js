const express = require('express');
const ejs = require('ejs');
const path = require('path');
const cors = require('cors');
const connectMongoDB = require('./config/mongo_config');
const cookieParser = require('cookie-parser');
const xssSanitizer = require('./middlewares/domPurify');
const indexRouter = require('./routes/index');
const searchRouter = require('./routes/search');
const categoryRouter = require('./routes/category');
const userRouter = require('./routes/user');
const productRouter = require('./routes/product');
const orderRouter = require('./routes/order');
const cartRouter = require('./routes/cart');
const notificationRouter = require('./routes/notification');
const userPrefRouter = require('./routes/userPref');
const dashboardRouter = require('./routes/dashboard');
const passwordRouter = require('./routes/password');
const app = express();


const corsOptions = {
  origin: ['https://boxtobe.mapa-server.org', "http://localhost:5173"],
  optionsSuccessStatus: 200,
  credentials: true
};

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors(corsOptions));
app.use(cookieParser());

// Middleware for clearing XSS attacks
app.use(xssSanitizer);

app.use(indexRouter);
app.use(searchRouter);
app.use(categoryRouter);
app.use(userRouter);
app.use(productRouter);
app.use(orderRouter);
app.use(cartRouter);
app.use(dashboardRouter);
app.use(notificationRouter);
app.use(userPrefRouter);
app.use(passwordRouter);

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'template', 'pdf'));

connectMongoDB();

require('./workers/cartWorker');
require('./workers/userWorker');

module.exports = { app };

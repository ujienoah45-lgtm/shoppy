const express = require('express');
const app = express();
const cookieParser = require('cookie-parser');
const authRoute = require('./Routes/authRoutes');
const productRoute = require('./Routes/productRoutes');
const aiRoute = require('./Routes/aiRoutes');
const userRoute = require('./Routes/userRoutes');
const cartRoute = require('./Routes/cartRoutes');
const orderRoute = require('./Routes/orderRoutes');
const paymentRoute = require('./Routes/paymentRoute');
const globalErrorHandler = require('./Controllers/errorControllers');
const CustomError = require('./Utils/customError');
const path = require('path');


const DOMAIN = process.env.DOMAIN || '/api/v1';
app.use(express.json());
app.use(express.urlencoded({extended: true}));
app.use(cookieParser());
app.use("/uploads", express.static(path.join(__dirname, 'uploads')))

app.use(`${DOMAIN}/auth`, authRoute);
app.use(`${DOMAIN}/products`, productRoute);
app.use(`${DOMAIN}/nexarch.ai`, aiRoute);
app.use(`${DOMAIN}/user`, userRoute);
app.use(`${DOMAIN}/cart`, cartRoute);
app.use(`${DOMAIN}/orders`, orderRoute);
app.use(`${DOMAIN}/payments`,paymentRoute);

app.all('*any', (req, res, next) => {
  const err = new CustomError(`Can't find ${req.originalUrl} on the server`, 404);
  return next(err);
});

app.use(globalErrorHandler);

module.exports = app;
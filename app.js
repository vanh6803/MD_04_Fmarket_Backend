var createError = require("http-errors");
var express = require("express");
var path = require("path");
var cookieParser = require("cookie-parser");
var logger = require("morgan");
var cors = require("cors");

var siteRouter = require("./routes/site.route");
var productsRouter = require("./routes/products.route");
var categoryRouter = require("./routes/category.route");
var reviewRoute = require("./routes/productRate.route");
var userRouter = require("./routes/account.route");
var orderRoute = require("./routes/order.route");
var cartRoute = require("./routes/cart.route");
var infoRoute = require("./routes/info.route");
var bannerRoute = require("./routes/banner.route");
var storeRoute = require("./routes/store.route");
var messageRoute = require("./routes/message.route");
var notifiRoute = require("./routes/notification.route");
var statisticalRoute = require('./routes/statistical.route'); 

var app = express();
app.use(cors());
// view engine setup
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");

app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "public")));

app.use("/api", siteRouter);
app.use("/api/category", categoryRouter);
app.use("/api/products", productsRouter);
app.use("/api/user", userRouter);
app.use("/api/store", storeRoute);
app.use("/api/review", reviewRoute);
app.use("/api/order", orderRoute);
app.use("/api/cart", cartRoute);
app.use("/api/info", infoRoute);
app.use("/api/banner", bannerRoute);
app.use('/api/message',messageRoute);
app.use('/api/notifi',notifiRoute);
app.use('/api/statistical', statisticalRoute);

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  console.error(err.message);
  res.locals.message = err.message;
  res.locals.error = req.app.get("env") === "development" ? err : {};
  // render the error page
  res.status(err.status || 500);
  if (req.originalUrl.indexOf("/api") == 0) {
    res.json({
      status: 0,
      msg: err.message,
    });
  } else {
    res.render("sites/error");
  }
});

module.exports = app;

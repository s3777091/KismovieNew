const createError = require("http-errors");
const express = require("express");
const path = require("path");

const cookieParser = require("cookie-parser");
const logger = require("morgan");
const session = require("express-session");
const indexRouter = require("./routes/index");
const adminRouter = require("./routes/beAdmin");
const serieRouter = require("./routes/series");
const app = express();

const requestIp = require("request-ip");
const compression = require("compression");

const MemoryStore = require("memorystore")(session);

app.set("trust proxy", 1); // trust first proxy
app.use(
  session({
    secret: "KiMovie-Session",
    resave: false,
    store: new MemoryStore({
      checkPeriod: 86400000, // prune expired entries every 24h
    }),
    saveUninitialized: true,
    cookie: { secure: true },
  })
);

app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");

app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());

app.use(express.static(path.join(__dirname, "public")));

app.use(requestIp.mw());
app.use("/", indexRouter);
app.use("/phim-bo", serieRouter);
app.use("/be-admin", adminRouter);

// app.use("/create-movies", createRouter);

app.get("/events", function (req, res) {
  res.setHeader("Content-Type", "text/event-stream");
  res.setHeader("Cache-Control", "no-cache");

  // send a ping approx every 2 seconds
  var timer = setInterval(function () {
    res.write("data: ping\n\n");

    // !!! this is the important part
    res.flush();
  }, 2000);

  res.on("close", function () {
    clearInterval(timer);
  });
});

app.use(
  compression({
    level: 1,
    filter: (req, res) => {
      if (req.header["x-no-compression"]) {
        return false;
      }
      return compression.filter(req, res);
    },
  })
);
// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404));
});
// error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get("env") === "development" ? err : {};
  // render the error page
  res.status(err.status || 500);
  res.render("error", { title: "KisMovie - 404", movie: null });
});

const common = require("./src/common");
const run_database = common.initDb();

const region = common.initRegion();
const catagory = common.initCategory();


Promise.all([region, catagory, run_database]);

module.exports = app;
const createError = require("http-errors");
const express = require("express");
const path = require("path");
const cookieParser = require("cookie-parser");
const logger = require("morgan");

const session = require("express-session");
const flash = require("connect-flash");
const msal = require("@azure/msal-node");
const cachePlugin = require("./cache-plugin");

const flashTemplateMiddleware = require("./middlewares/flash.js");
const authMiddleware = require("./middlewares/auth.js");
const indexRouter = require("./routes/index");
const accountRouter = require("./routes/account");
const usersRouter = require("./routes/users");
const syncRouter = require("./routes/sync");

require("dotenv").config();
const app = express();

// view engine setup
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "hbs");

// In-memory storage of logged-in users
// For demo purposes only, production apps should store
// this in a reliable storage
app.locals.users = {};

// MSAL config
const msalConfig = {
  auth: {
    clientId: process.env.OAUTH_APP_ID,
    clientSecret: process.env.OAUTH_APP_SECRET,
    authority: process.env.OAUTH_AUTHORITY,
    redirectUri: process.env.OAUTH_REDIRECT_URI,
    postLogoutRedirectUri: process.env.OAUTH_REDIRECT_URI,
  },
  // cache: {
  //   cachePlugin,
  // },
  system: {
    loggerOptions: {
      loggerCallback(loglevel, message, containsPii) {
        console.log(message);
      },
      piiLoggingEnabled: false,
      logLevel: msal.LogLevel.Verbose,
    },
  },
};

// Create msal application object
app.locals.msalClient = new msal.ConfidentialClientApplication(msalConfig);

// Middlewares
// NOTE: Uses default in-memory session store, which is not
// suitable for production
app.use(
  session({
    secret: "your_secret_value_here",
    resave: false,
    saveUninitialized: false,
    unset: "destroy",
  })
);
app.use(flash());
app.use(flashTemplateMiddleware);
app.use(authMiddleware);
app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "public")));

// Routers
app.use("/", indexRouter);
app.use("/account", accountRouter);
app.use("/sync", syncRouter);
app.use("/users", usersRouter);

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
  res.render("error");
});

module.exports = app;

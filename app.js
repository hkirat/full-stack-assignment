const express = require("express");
const app = express();
const passport = require("passport");
const bodyParser = require("body-parser");
app.use(bodyParser.json());

//basic passport configuration:
require("./authServices/passport-jwt");
require("./authServices/passport-google");
app.use(passport.initialize());

//Routes:
const googleAuthRouter = require("./routes/googleAuthRoute");
const harkiratSubscriber = require("./routes/subscriberRoute");
app.use(googleAuthRouter);
app.use("/api/v1/subscriber", harkiratSubscriber);

//handeling global unhandled error and rejection ,e.g if no route is defined for certain url
app.all("*", (req, res, next) => {
  res.status(404).json({
    status: "Failed",
    message: `${req.originalUrl} This is unhandled Rejection,`,
  });
});

module.exports = app;

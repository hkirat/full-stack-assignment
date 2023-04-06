if (process.env.NODE_ENV !== "production") {
    require("dotenv").config();
  }
  
  const express = require("express");
  

  const path = require("path");
  const ExpressError = require("./utils/errors/ExpressError");
  const catchAsync = require("./utils/errors/catchAsync");

  const User = require("./src/models/User");
  

  
  //routers
  const problemRouter= require("./src/routers/problemRouter");
  const userRouter = require("./src/routers/userRouter");
  const submissionRouter= require("./src/routers/submissionRouter");
  
  require("./src/db/mongoose");
  
  const app = express();
  const PORT = process.env.PORT;
  
  app.use(express.urlencoded({ extended: true })); 
  app.use(express.json());
  
  app.use(userRouter);
  app.use(problemRouter);
  app.use(submissionRouter);
  
  app.get("/", async (req, res) => {
    res.send("Welcome to leetcode clone assignment by Harkirat Singh 💚");
  });
  
  app.all("*", (req, res, next) => {
    return next(new ExpressError("Page not found", 404));
  });
  
  app.use((err, req, res, next) => {
    const { statusCode = 500 } = err;
    if (!err.message) err.message = "Oh No, Something Went Wrong!";
    res.status(statusCode).send(err.message);
  });
  
  app.listen(PORT, () => {
    console.log(`server running on port ${PORT}`);
  });
  
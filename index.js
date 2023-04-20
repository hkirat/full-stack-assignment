const express = require("express");
const config = require("./config");
const authRouter = require("./routers/auth");
const questionRouter = require("./routers/question");
const submissionRouter = require("./routers/submission");
const { connectToMongoDB } = require("./utils/db");

const app = express();

// Middleware to parse JSON request body
app.use(express.json());

// Establish connection with the database
connectToMongoDB();

// API Routes
app.use("/", authRouter);
app.use("/", questionRouter);
app.use("/", submissionRouter);

app.listen(config.port, () => {
  console.log(`Server is running on port ${config.port}`);
});

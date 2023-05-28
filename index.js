const express = require("express");
const app = express();
const authRouter = require("./src/routes/auth.routes");
const submissionRouter = require("./src/routes/submission.routes");
const questionRouter = require("./src/routes/question.routes");

const loggingMiddleware = require("./src/middlewares/logging.middleware.js");
const errorHandler = require("./src/middlewares/errorHandler.middleware");
const responseHandler = require("./src/middlewares/responseHandler.middleware");
const port = 3001;

app.use(express.json());
app.use(loggingMiddleware);
app.use(responseHandler);

app.use("/", authRouter);
app.use("/submissions", submissionRouter);
app.use("/questions", questionRouter);

app.use(errorHandler);

app.listen(port, function () {
  console.log(`Example app listening on port ${port}`);
});

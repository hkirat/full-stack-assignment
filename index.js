const express = require("express");
const app = express();
// const port = 3001
const port = 3000;
const bodyParser = require("body-parser");
const signupRouter = require("./routes/signup.route");
const loginRouter = require("./routes/login.route");
const questionsRouter = require("./routes/questions.route");
const submissionsRouter = require("./routes/submissions.route");
const adminSignupRouter = require("./admin/routes/admin.signup.route");
const adminLoginRouter = require("./admin/routes/admin.login.route");
const adminQuestionsRouter = require("./admin/routes/admin.questions.route");

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// const USERS = [];

// const QUESTIONS = [
//   {
//     title: "Two states",
//     description: "Given an array , return the maximum of the array?",
//     testCases: [
//       {
//         input: "[1,2,3,4,5]",
//         output: "5",
//       },
//     ],
//   },
// ];

// const SUBMISSION = [];

app.use(signupRouter);
app.use(loginRouter);
app.use(questionsRouter);
app.use(submissionsRouter);
app.use(adminQuestionsRouter);

// leaving as hard todos
// Create a route that lets an admin add a new problem
// ensure that only admins can do that.

app.use(adminSignupRouter);
app.use(adminLoginRouter);
app.use(adminQuestionsRouter);

app.listen(port, function () {
  console.log(`Example app listening on port ${port}`);
});

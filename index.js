const express = require("express");
const app = express();
const port = 3001;

const USERS = [];

const QUESTIONS = [
  {
    title: "Two states",
    description: "Given an array , return the maximum of the array?",
    testCases: [
      {
        input: "[1,2,3,4,5]",
        output: "5",
      },
    ],
  },
];

const SUBMISSION = [];

app.post("/signup", function (req, res) {
  // Add logic to decode body
  // body should have email and password
  const { email, password } = req.body;

  //Store email and password (as is for now) in the USERS array above (only if the user with the given email doesnt exist)
  if (USERS.find((user) => user.email === email)) {
    return res.status(409).json({
      message: "This account is already created. Try signing in instead.",
    });
  }
  USERS.push({ email, password });

  // return back 200 status code to the client
  return res.status(200).json({ message: "Account created successfully" });
});

app.post("/login", function (req, res) {
  // Add logic to decode body
  // body should have email and password
  const { email, password } = req.body;

  // Check if the user with the given email exists in the USERS array
  // Also ensure that the password is the same

  // If the password is the same, return back 200 status code to the client
  // Also send back a token (any random string will do for now)
  // If the password is not the same, return back 401 status code to the client
  const user = USERS.find((user) => user.email === email);
  if (user && user.password === password) {
    //Creating a random token
    const token = Math.random().toString(36).substring(2);
    res.status(200).json({ token });
  } else return res.status(401).json({ message: "Invalid email or password" });
});

app.get("/questions", function (req, res) {
  //return the user all the questions in the QUESTIONS array
  res.status(200).json({ questions: QUESTIONS });
});

app.get("/submissions", function (req, res) {
  // return the users submissions for this problem
  //For now, we are sending the email of the user from the client side. But the better way is to store the email address in the session or in the database.
  const { email } = req.body;
  const { problemId } = req.query;
  const userSubmissions = SUBMISSION.filter(
    (submission) =>
      submission.email === email && submission.problemId === problemId
  );
  res.status(200).json({ submissions: userSubmissions });
});

app.post("/submissions", function (req, res) {
  // let the user submit a problem, randomly accept or reject the solution
  // Store the submission in the SUBMISSION array above
  res.send("Hello World from route 4!");
});

// leaving as hard todos
// Create a route that lets an admin add a new problem
// ensure that only admins can do that.

app.listen(port, function () {
  console.log(`Example app listening on port ${port}`);
});

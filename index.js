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

  if (!email || !password) {
    return res.status(400).json({
      success: false,
      message: "All fields are required!",
    });
  }

  const existingUser = USERS.find((user) => user.email === email);
  //Store email and password (as is for now) in the USERS array above (only if the user with the given email doesnt exist)
  if (existingUser)
    return res.status(400).json({ message: "User already exists" });

  USERS.push({ email, password });
  // return back 200 status code to the client
  res.send("Hello World!");
  res.status(200).json({ message: "User registered succesfully" });
});

app.post("/login", function (req, res) {
  // Add logic to decode body
  // body should have email and password
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({
      success: false,
      message: "All fields are required!",
    });
  }

  // Check if the user with the given email exists in the USERS array
  const existingUser = USERS.find((user) => user.email === email);

  if (!existingUser)
    return res.status(401).json({ message: "Invalid Credentials!" });

  // Also ensure that the password is the same
  if (existingUser.password !== password)
    return res.status(401).json({ message: "Invalid Credentials!" });

  const token = "jajscjsdbhwsamdvldmdkn"; //random string for now

  // If the password is the same, return back 200 status code to the client
  // Also send back a token (any random string will do for now)
  // If the password is not the same, return back 401 status code to the client

  res.send("Hello World from route 2!");
  res.status(200).json({ token });
});

app.get("/questions", function (req, res) {
  //return the user all the questions in the QUESTIONS array
  res.send("Hello World from route 3!");
  res.status(200).json({
    success: true,
    QUESTIONS,
  });
});

app.get("/submissions/:id", function (req, res) {
  // return the users submissions for this problem
  const questionId = parseInt(req.params.id);
  const question = QUESTIONS[questionId];
  const submissions = SUBMISSION.filter(
    (submission) => submission.id === questionId
  );
  res.send("Hello World from route 4!");
  res.status(200).json({ question, submissions });
});

app.post("/submissions", function (req, res) {
  // let the user submit a problem, randomly accept or reject the solution
  // Store the submission in the SUBMISSION array above
  const { solution } = req.body;

  const question = QUESTIONS.find(
    (ques) => ques.title === solution.questionTitle
  );

  // Randomly accept or reject the solution
  const isAccepted = Math.random() >= 0.5;

  // Create a new submission object with the problem, solution, and acceptance status
  const newSubmission = { question, solution, isAccepted };

  // Add the new submission to the SUBMISSIONS array
  SUBMISSION.push(newSubmission);

  // Send a response with the new submission object
  res.status(200).json({
    success: true,
    newSubmission,
  });
});

// leaving as hard todos
// Create a route that lets an admin add a new problem
// ensure that only admins can do that.

app.listen(port, function () {
  console.log(`Example app listening on port ${port}`);
});

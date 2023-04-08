const express = require("express");
const app = express();
const port = 3001;

const USERS = [];

const QUESTIONS = [
  {
    title: "Two states",
    description: "Given an array, return the maximum of the array?",
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
  const { email, password } = req.body;

  const userExists = USERS.some((user) => user.email === email);

  if (userExists) {
    return res.status(400).send("User already exists");
  }

  USERS.push({ email, password });

  // Add logic to decode body
  // Body should have email and password
  // Store email and password (as is for now) in the USERS array above (only if the user with the given email doesnt exist)
  // Return back 200 status code to the client
  res.status(200).send("User created successfully");
});

app.post("/login", function (req, res) {
  const { email, password } = req.body;

  const userExists = USERS.some(
    (user) => user.email === email && user.password === password
  );

  if (userExists) {
    // Add logic to decode body
    // Body should have email and password
    // Check if the user with the given email exists in the USERS array
    // Also ensure that the password is the same
    // If the password is the same, return back 200 status code to the client
    // Also send back a token (any random string will do for now)
    res.status(200).send("You are logging in");
  } else {
    // If the password is not the same, return back 401 status code to the client
    res.status(401).send("user not found");
  }
});

app.get("/questions", function (req, res) {
  // Return the user all the questions in the QUESTIONS array
  res.send(QUESTIONS);
});

app.get("/submissions", function (req, res) {
  const { problem } = req.query;

  const submissionsForProblem = SUBMISSION.filter(
    (submission) => submission.problem === problem
  );

  // Return the users submissions for this problem
  res.send(submissionsForProblem);
});

app.post("/submissions", function (req, res) {
  const { problemId, userId, solution } = req.body;

  if (!problemId || !userId || !solution) {
    res.status(400).send("Missing required fields in request body");
    return;
  }

  const newSubmission = { problemId, userId, solution };
  SUBMISSION.push(newSubmission);

  // Let the user submit a problem, randomly accept or reject the solution
  // Store the submission in the SUBMISSION array above
  res.status(201).send({
    message: "Submission successful",
    submissionId: newSubmission.id,
  });
});

// Leaving as hard todos
// Create a route that lets an admin add a new problem
// Ensure that only admins can do that.

app.listen(port, function () {
  console.log(`Example app listening on port ${port}`);
});

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

app.use(express.json());

app.post("/signup", function (req, res) {
  // Add logic to decode body
  // body should have email and password
  const { email, password } = req.body;
  if (!email || !password) {
    return res.status(400).send("Email and password are required");
  }

  //Store email and password (as is for now) in the USERS array above (only if the user with the given email doesnt exist)
  if (USERS.find((user) => user.email === email)) {
    return res.status(400).send("User already exists");
  }

  const newUser = { email, password };

  USERS.push(newUser);

  // return back 200 status code to the client
  res.status(201).send("User created successfully");
});

app.post("/login", function (req, res) {
  // Add logic to decode body
  // body should have email and password
  const { email, password } = req.body;
  if (!email || !password) {
    return res.status(400).send("Email and password are required");
  }
  // Check if the user with the given email exists in the USERS array
  // Also ensure that the password is the same
  const user = USERS.find((user) => user.email === email);
  if (!user) {
    return res.status(404).send("User does not exist");
  }

  if (user.password !== password) {
    return res.status(401).send("Password is incorrect");
  }

  // If the password is the same, return back 200 status code to the client
  // Also send back a token (any random string will do for now)
  // If the password is not the same, return back 401 status code to the client
  const token =
    Math.random().toString(36).substring(2) +
    Math.random().toString(36).substring(2);

  res.status(200).send({ token });
});

app.get("/questions", function (req, res) {
  //return the user all the questions in the QUESTIONS array
  res.status(200).send(QUESTIONS);
});

app.get("/submissions", function (req, res) {
  // return the users submissions for this problem
  res.status(200).send(SUBMISSION);
});

app.post("/submissions", function (req, res) {
  // let the user submit a problem, randomly accept or reject the solution
  // Store the submission in the SUBMISSION array above
  const { problem, solution } = req.body;
  if (!problem || !solution) {
    return res.status(400).send("Problem and solution are required");
  }

  //randomly accept or reject the solution
  const isAccepted = Math.random() > 0.5;

  const newSubmission = {
    problem,
    solution,
    isAccepted,
  };

  SUBMISSION.push(newSubmission);

  res.status(201).send({ isAccepted });
});

// leaving as hard todos
// Create a route that lets an admin add a new problem
// ensure that only admins can do that.

app.listen(port, function () {
  console.log(`App listening on port ${port}`);
});

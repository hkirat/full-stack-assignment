const express = require("express");
const { generateRandomString } = require("./utils/generateRandomString");
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
  const found = USERS.find((i) => i.email === email);
  if (found) {
    res.status(400).send("email already exist.");
  }

  USERS.push({ email, password });

  // return back 200 status code to the client
  res.status(200).send("Created");
});

app.post("/login", function (req, res) {
  // Add logic to decode body
  // body should have email and password
  const { email, password } = req.body;

  // Check if the user with the given email exists in the USERS array
  // Also ensure that the password is the same
  const found = USERS.find((i) => i.email === email && i.password === password);
  if (!found) {
    res.status(401).send("Invalid Email and Password");
  }

  // If the password is the same, return back 200 status code to the client
  // Also send back a token (any random string will do for now)
  // If the password is not the same, return back 401 status code to the client
  const token = generateRandomString(32);

  res.status(200).send(token);
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
  const userSubmission = req.body;
  const isAccepted = Math.random() < 0.5;
  SUBMISSION.push({
    ...userSubmission,
    isAccepted: isAccepted,
  });

  res.status(201).send({ accepted: isAccepted });
});

// leaving as hard todos
// Create a route that lets an admin add a new problem
// ensure that only admins can do that.

const adminToken = generateRandomString(32);
app.post("/admin/problem", function (req, res) {
  const { title, description, testCases } = req.body;

  if (!adminToken) {
    res.status(403).send("unauthorized");
  }

  QUESTIONS.push({
    title,
    description,
    testCases,
  });

  res.status(201).send("Added");
});

app.listen(port, function () {
  console.log(`Example app listening on port ${port}`);
});

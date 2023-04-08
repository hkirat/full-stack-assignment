const express = require("express");
const app = express();
const port = 3001;

const QUESTIONS = [{
  title: "Two states",
  description: "Given an array , return the maximum of the array?",
  testCases: [{
    input: "[1,2,3,4,5]",
    output: "5",
  }, ],
}, ];

const SUBMISSION = [];

const USERS = [];

app.post("/signup", function (req, res) {
  // Add logic to decode body
  // body should have email and password
  const {
    email,
    password
  } = req.body;

  //Store email and password (as is for now) in the USERS array above (only if the user with the given email doesnt exist)
  if (!USERS.find((user) => user.email === email)) {
    USERS.push({
      email,
      password
    });
  }

  // return back 200 status code to the client
  res.status(200).send("OK");
});

app.post("/login", function (req, res) {
  // Add logic to decode body
  // body should have email and password
  const {
    email,
    password
  } = req.body;

  // Check if the user with the given email exists in the USERS array
  // Also ensure that the password is the same
  const user = USERS.find((user) => user.email === email);
  if (!user || user.password !== password) {
    return res.status(401).send("Invalid email or password");
  }

  // If the password is the same, return back 200 status code to the client
  // Also send back a token (any random string will do for now)
  const token = "random-string";
  res.status(200).send({
    token
  });
});

app.get("/questions", function (req, res) {
  //return the user all the questions in the QUESTIONS array

  res.send(QUESTIONS);
});

app.get("/submissions", function (req, res) {
  // return the users submissions for this problem
  res.send(SUBMISSION);
});

app.post("/submissions", function (req, res) {
  // randomly accept or reject the solution
  const accepted = Math.random() < 0.5;

  // store the submission in the SUBMISSION array
  SUBMISSION.push(req.body);

  // send a response to the user
  if (accepted) {
    res.send("Your solution was accepted!");
  } else {
    res.send("Your solution was rejected.");
  }
});

// leaving as hard todos
// Create a route that lets an admin add a new problem
// ensure that only admins can do that.
app.post("/problems", function (req, res) {
  // check if the user is an admin
  if (!req.user || !req.user.isAdmin) {
    return res.status(401).send("Unauthorized");
  }

  // add the new problem to the PROBLEMS array
  PROBLEMS.push(req.body);

  // send a response to the user
  res.send("Problem added successfully!");
});

app.listen(port, function () {
  console.log(`Example app listening on port ${port}`);
});
const express = require('express');
const bodyParser = require('body-parser');
const app = express();
const port = 3001;

const USERS = [];

const QUESTIONS = [{
  title: "Two states",
  description: "Given an array, return the maximum of the array?",
  testCases: [{
    input: "[1,2,3,4,5]",
    output: "5"
  }]
}];

const SUBMISSIONS = [];

app.use(bodyParser.json());

app.post('/signup', function(req, res) {
  // Add logic to decode body
  // body should have email and password
  const { email, password } = req.body;

  // Store email and password (as is for now) in the USERS array above
  // Only if the user with the given email doesn't exist
  const existingUser = USERS.find(user => user.email === email);
  if (!existingUser) {
    USERS.push({ email, password });
  }

  // Return 200 status code to the client
  res.sendStatus(200);
});

app.post('/login', function(req, res) {
  // Add logic to decode body
  // body should have email and password
  const { email, password } = req.body;

  // Check if the user with the given email exists in the USERS array
  // Also ensure that the password is the same
  const existingUser = USERS.find(user => user.email === email && user.password === password);

  if (existingUser) {
    // If the password is the same, return 200 status code to the client
    // Also send back a token (any random string will do for now)
    const token = 'random-token';
    res.status(200).json({ token });
  } else {
    // If the password is not the same, return 401 status code to the client
    res.sendStatus(401);
  }
});

app.get('/questions', function(req, res) {
  // Return all the questions in the QUESTIONS array to the user
  res.json(QUESTIONS);
});

app.get('/submissions', function(req, res) {
  // Return the user's submissions for this problem
  res.json(SUBMISSIONS);
});

app.post('/submissions', function(req, res) {
  // Let the user submit a problem (randomly accept or reject the solution)
  // Store the submission in the SUBMISSIONS array above
  const submission = req.body;
  const isAccepted = Math.random() < 0.5; // Randomly accepting or rejecting the submission

  submission.accepted = isAccepted;
  SUBMISSIONS.push(submission);

  res.sendStatus(200);
});

// TODO: Create a route that lets an admin add a new problem
// Ensure that only admins can do that.

app.listen(port, function() {
  console.log(`Example app listening on port ${port}`);
});

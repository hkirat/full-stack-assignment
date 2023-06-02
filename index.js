const express = require('express');
const app = express();
const port = 3000;

const USERS = [];

const QUESTIONS = [{
    title: "Two states",
    description: "Given an array, return the maximum of the array?",
    testCases: [{
        input: "[1,2,3,4,5]",
        output: "5"
    }]
}];

const SUBMISSION = [];

app.use(express.json()); // Middleware to parse JSON in request body

app.post('/signup', function(req, res) {
  const { email, password } = req.body; // Decode body - assuming it contains email and password

  // Check if the user with the given email already exists
  const existingUser = USERS.find(user => user.email === email);
  if (existingUser) {
    res.status(409).send('User already exists');
    return;
  }

  // Store email and password in the USERS array
  USERS.push({ email, password });

  res.sendStatus(200); // Return 200 status code to the client
});

app.post('/login', function(req, res) {
  const { email, password } = req.body; // Decode body - assuming it contains email and password

  // Find the user with the given email
  const user = USERS.find(user => user.email === email);

  if (!user || user.password !== password) {
    res.sendStatus(401); // Return 401 status code to the client
    return;
  }

  // Return 200 status code and a token to the client
  res.status(200).json({ token: 'your-token' });
});

app.get('/questions', function(req, res) {
  res.json(QUESTIONS); // Return all the questions in the QUESTIONS array
});

app.get('/submissions', function(req, res) {
  res.json(SUBMISSION); // Return the user's submissions for this problem
});

app.post('/submissions', function(req, res) {
  const submission = req.body; // Assuming the submission is sent in the request body

  // Randomly accept or reject the solution
  const isAccepted = Math.random() < 0.5;

  // Store the submission in the SUBMISSION array
  SUBMISSION.push({ ...submission, isAccepted });

  res.sendStatus(200); // Return 200 status code to the client
});

// TODO: Create a route that lets an admin add a new problem
// Ensure that only admins can do that.

app.listen(port, function() {
  console.log(`Example app listening on port ${port}`);
});

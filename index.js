const express = require('express');
const app = express();
const port = 3000;

const USERS = [];

const QUESTIONS = [{
    title: "Two states",
    description: "Given an array , return the maximum of the array?",
    testCases: [{
        input: "[1,2,3,4,5]",
        output: "5"
    }]
}];


const SUBMISSION = [

];

app.post('/signup', function(req, res) {
  const { email, password } = req.body;

  // Check if the email is already registered
  const existingUser = USERS.find(user => user.email === email);
  if (existingUser) {
    return res.status(400).json({ message: 'Email already registered' });
  }

  // Create a new user object
  const newUser = { email, password };

  // Add the user to the array
  USERS.push(newUser);

  // Return a success response
  res.status(200).json({ message: 'Signup successful' });
});

app.post('/login', function(req, res) {
  // Decode the request body
  const { email, password } = req.body;

  // Find the user with the given email in the USERS array
  const user = USERS.find(user => user.email === email);

  // If the user is not found or the password is incorrect
  if (!user || user.password !== password) {
    return res.status(401).json({ message: 'Invalid email or password' });
  }

  // If the password is correct, generate a token (any random string)
  const token = 'RANDOM_TOKEN';

  // Return a success response with the token
  res.status(200).json({ message: 'Login successful', token });
});

app.get('/questions', function(req, res) {
  res.json(QUESTIONS);
});


app.get("/submissions", function(req, res) {
  const userId = req.query.userId; // Assuming the user ID is passed as a query parameter
  const problemId = req.query.problemId; // Assuming the problem ID is passed as a query parameter

  // Retrieve the submissions for the specified user and problem
  const userSubmissions = submissions.filter(submission => {
    return submission.userId === userId && submission.problemId === problemId;
  });

  res.json(userSubmissions);
});


app.post("/submissions", function(req, res) {
  const { userId, problemId, solution } = req.body;

  // Create a new submission object
  const newSubmission = {
    userId,
    problemId,
    solution,
  };

  // Store the submission in the SUBMISSION array
  SUBMISSION.push(newSubmission);

  res.json({ message: "Submission received" });
});


// leaving as hard todos
// Create a route that lets an admin add a new problem
// ensure that only admins can do that.

app.listen(port, function() {
  console.log(`Example app listening on port ${port}`)
})
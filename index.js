const express = require('express')
const app = express()
const port = 3001

const USERS = [
  
]

const QUESTIONS = [{
  title: "whole multiplication",
  description: "find the product every  element in an array",
  testCases: [{
    input: "[1,2,3,4,5]",
    output: "15"
  }]
}];

const SUBMISSIONS = [


  
]

// Route for user signup
app.post('/signup', function (req, res) {
  const { email, password } = req.body;

  // Check if user already exists
  const userExists = USERS.some(user => user.email === email)
  if (userExists) {
    return res.status(400).send('User already exists')
  }

  // Create new user
  const newUser = {
    email,
    password
  };
  USERS.push(newUser)

  res.sendStatus(200)
});

// Route for user login
app.post('/login', function (req, res) {
  const { email, password } = req.body;

  // Checking if user exists and password matches
  const user = USERS.find(user => user.email === email)
  if (!user || user.password !== password) {
    return res.status(401).send('Invalid email or password')
  }

  // Return success response with token
  res.status(200).json({ token: 'randomToken' })
});

// created Route for retrieving questions
app.get('/questions', function (req, res) {
  res.json(QUESTIONS)
});

// Route for retrieving user submissions for a problem
app.get('/submissions', function (req, res) {
  const { userId } = req.query;

  // Filter submissions based on userId
  const userSubmissions = SUBMISSIONS.filter(submission => submission.userId === userId)
  
  res.json(userSubmissions)
});

// Route for submitting a problem solution
app.post('/submissions', function (req, res) {
  const { userId, problemId, solution } = req.body

  // Randomly accept or reject the solution
  const isAccepted = Math.random() < 0.5;

  // Create new submission object
  const newSubmission = {
    userId,
    problemId,
    solution,
    isAccepted
  };

  SUBMISSIONS.push(newSubmission)

  res.sendStatus(200)
});

// Route for adding a new problem (Only accessible by admins)
app.post('/problems', function (req, res) {
  const { isAdmin, problem } = req.body;

  // Check if user is an admin
  if (!isAdmin) {
    return res.status(403).send('Only admins can add new problems')
  }

  // Add the new problem to QUESTIONS array
  QUESTIONS.push(problem)

  res.sendStatus(200)
});

app.listen(port, function () {
  console.log(`Example app listening on port ${port}`)
});

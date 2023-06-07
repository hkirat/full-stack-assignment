const express = require('express');
const app = express();
const port = 3001;

const USERS = [];

const QUESTIONS = [{
  title: "Two states",
  description: "Given an array, return the maximum of the array.",
  testCases: [{
    input: "[1,2,3,4,5]",
    output: "5"
  }]
}];

const SUBMISSIONS = [];

// Helper function to check if a user exists with the given email
function userExists(email) {
  return USERS.some(user => user.email === email);
}

// Helper function to find a question by its title
function findQuestionByTitle(title) {
  return QUESTIONS.find(question => question.title === title);
}

app.use(express.json());

app.post('/signup', function(req, res) {
  const { email, password } = req.body;

  // Check if the user with the given email already exists
  if (userExists(email)) {
    return res.status(409).send('User already exists');
  }

  // Create a new user object and add it to the USERS array
  const newUser = {
    email,
    password
  };
  USERS.push(newUser);

  // Return a success response
  res.sendStatus(200);
});

app.post('/login', function(req, res) {
  const { email, password } = req.body;

  // Find the user with the given email
  const user = USERS.find(user => user.email === email);

  // Check if the user exists and the password matches
  if (!user || user.password !== password) {
    return res.status(401).send('Invalid email or password');
  }

  // Generate a random token (for simplicity, we'll use a hardcoded token for now)
  const token = 'random_token';

  // Return the token in the response
  res.status(200).json({ token });
});

app.get('/questions', function(req, res) {
  // Return all the questions in the QUESTIONS array
  res.json(QUESTIONS);
});

app.get('/submissions', function(req, res) {
  // Return the user's submissions for this problem
  res.json(SUBMISSIONS);
});

app.post('/submissions', function(req, res) {
  const { questionTitle, solution } = req.body;

  // Find the question by its title
  const question = findQuestionByTitle(questionTitle);

  // Randomly accept or reject the solution (for simplicity)
  const isAccepted = Math.random() < 0.5;

  // Store the submission in the SUBMISSIONS array
  const submission = {
    questionTitle,
    solution,
    isAccepted
  };
  SUBMISSIONS.push(submission);

  // Return a success response
  res.sendStatus(200);
});

// TODO: Create a route that lets an admin add a new problem
// Ensure that only admins can do that.

app.listen(port, function() {
  console.log(`Example app listening on port ${port}`);
});

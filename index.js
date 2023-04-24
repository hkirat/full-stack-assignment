const express = require('express');
const app = express();
const port = 3001;

// Array to store user information
const USERS = [];

// Array to store questions
const QUESTIONS = [{
  title: "Two states",
  description: "Given an array , return the maximum of the array?",
  testCases: [{
    input: "[1,2,3,4,5]",
    output: "5"
  }]
}];

// Array to store submissions
const SUBMISSION = [];

// Create a new user
app.post('/signup', function(req, res) {
  const email = req.body.email;
  const password = req.body.password;

  if (!email || !password) {
    return res.status(400).send('Email and password required');
  }

  // Check if user with same email and password already exists
  if (USERS.some(user => user.email === email && user.password === password)) {
    return res.status(409).send('User with email and password already exists');
  }

  // Add new user
  USERS.push({ email, password });
  return res.status(200).send('User created successfully');
});

// Login to existing account
app.post('/login', function(req, res) {
  const { email, password } = req.body;

  // Check if user exists
  const user = USERS.find(user => user.email === email && user.password === password);

  if (user) {
    // Generate token and send it as response
    const token = Math.random().toString(36).substring(7);
    res.status(200).send(`Here is your userId "${token}"`);
  } else {
    res.status(401).send('Invalid email or password');
  }
});

// Get all available questions
app.get('/questions', function(req, res) {
  res.send(QUESTIONS);
});

// Get submissions of a user based on token
app.get("/submissions", function(req, res) {
  const token = req.headers.authorization.split(" ")[1];

  if (token) {
    // Filter the submissions based on token
    const userSubmissions = SUBMISSION.filter(submission => submission.token === token);

    res.send(userSubmissions);
  } else {
    res.status(401).send("Unauthorized");
  }
});

// Submit the solution of a problem
app.post("/submissions", function(req, res) {
  const { userId, problemId, solution } = req.body;

  if (!userId || !problemId || !solution) {
    return res.status(400).send('userId, problemId, and solution are required');
  }

  // Randomly accept or reject the solution
  const isAccepted = Math.random() >= 0.5;
  SUBMISSION.push({ userId, problemId, solution, isAccepted });

  const response = { isAccepted };
  res.json(response);
});

// Middleware to check if the user is admin
function isAdmin(req, res, next) {
  const token = req.headers.authorization.split(" ")[1];

  if (token && USERS.some(user => user.token === token && user.isAdmin)) {
    next();
  } else {
    res.status(401).send("Unauthorized");
  }
}

// Add new problem (only admin can access)
app.post("/problems", isAdmin, function (req, res) {
  const { title, description, testCases } = req.body;

  if (!title || !description || !testCases) {
    return res.status(400).send("Missing required fields");
  }

  // Add new problem
  PROBLEMS.push({ title, description, testCases });
  res.status(200).send("Problem added successfully");
});

app.listen(port, function() {
  console.log(`Example app listening on port ${port}`);
});

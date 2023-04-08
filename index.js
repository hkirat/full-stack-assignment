const express = require('express');
const { json } = require('express');
const { v4: uuidv4 } = require('uuid');

const app = express();
const port = 3001;
app.use(json()) // to parse req.body - no need to use body parser

const USERS = [];

const QUESTIONS = [{
  id: 1,
  title: "Two states",
  description: "Given an array, return the maximum of the array?",
  testCases: [{
    input: "[1,2,3,4,5]",
    output: "5"
  }]
}];

const SUBMISSIONS = [];

// Route to sign up a user
app.post('/signup', function (req, res) {
  const { email, password } = req.body;

  // Check if the user with the given email already exists
  const existingUser = USERS.find(user => user.email === email);
  if (existingUser) {
    return res.status(409).send('User already exists');
  }

  // Add the new user to the USERS array
  USERS.push({ email, password });

  // Return 200 status code to the client
  res.sendStatus(200);
});

// Route to login a user
app.post('/login', function (req, res) {
  const { email, password } = req.body;

  // Find the user with the given email
  const user = USERS.find(user => user.email === email);

  // If the user does not exist or the password is incorrect, return 401 status code
  if (!user || user.password !== password) {
    return res.status(401).send('Invalid email or password');
  }

  // Generate a random token for the user and return it to the client
  const token = Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
  res.status(200).json({ token });
});

// Route to get all questions
app.get('/questions', function (req, res) {
  // Return all questions in the QUESTIONS array
  res.json(QUESTIONS);
});

// Route to get a user's submissions for a specific problem
// ?user=USER_EMAIL&problemId=PROBLEM_ID
app.get("/submissions", function (req, res) {
  // Get the user and problem query parameters from the request
  const userEmail = req.query.user;
  const problemId = parseInt(req.query.problemId);

  // Filter the submissions array to get the submissions for the specified user and problem
  const userSubmissions = SUBMISSIONS.filter(submission => {
    return submission.email === userEmail && submission.problemId === problemId;
  });

  // Return the submissions
  res.send(userSubmissions);
});

// Route to let a user submit a problem solution
app.post("/submissions", function (req, res) {
  const { email, problemId, solution } = req.body;

  // Randomly accept or reject the solution
  const isAccepted = Math.random() < 0.5;

  // Store the submission in the SUBMISSIONS array
  SUBMISSIONS.push({ email, problemId, solution, isAccepted });

  // Return 200 status code to the client
  res.sendStatus(200);
});

// Route to let an admin add a new problem
// Only admins can access this route
app.post("/problems", function (req, res) {
  const { title, description, testCases } = req.body;
  const isAdmin = true; // replace with actual admin authentication logic

  // Check if the user is an admin
  if (!isAdmin) {
    return res.status(401).send('Only admins can add new problems');
  }

  // Generate a unique ID for the new question using uuid
  const id = uuidv4();

  // Add the new problem to the QUESTIONS array
  QUESTIONS.push({ id, title, description, testCases });

  // Return 200 status code to the client
  res.sendStatus(200);
});

app.listen(port, function () {
  console.log(`Example app listening on port ${port}`);
});
const express = require('express');
const app = express();
const port = 3001;

const USERS = [];
const QUESTIONS = [
  {
    title: "Two states",
    description: "Given an array, return the maximum of the array?",
    testCases: [
      {
        input: "[1,2,3,4,5]",
        output: "5"
      }
    ]
  }
];
const SUBMISSIONS = [];

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

//Starting Page//
app.get('/', function(req, res) {
  res.send("Welcome to Starting page");
});

// Routes
app.post('/signup', function(req, res) {
  const { email, password } = req.body;

  // Check if a user with the given email already exists
  const userExists = USERS.some(user => user.email === email);
  if (userExists) {
    return res.status(400).send('User already exists');
  }

  // Store email and password in the USERS array
  USERS.push({ email, password });

  // Return a success response
  return res.status(200).send('User created successfully');
});

app.post('/login', function(req, res) {
  const { email, password } = req.body;

  // Check if the user with the given email exists in the USERS array
  const user = USERS.find(user => user.email === email);

  if (user && user.password === password) {
    // Return a success response and a token
    return res.status(200).send('Login successful. Token: YOUR_TOKEN_HERE');
  } else {
    // Return an error response
    return res.status(401).send('Incorrect email or password');
  }
});

//Questions Page//
app.get('/questions', function(req, res) {
  res.json(QUESTIONS);
});
//Submissions Page//
app.get('/submissions', function(req, res) {
  res.json(SUBMISSIONS);
});

app.post('/submissions', function(req, res) {
  const submission = req.body;

  // Randomly accept or reject the submission
  const isAccepted = Math.random() < 0.5;

  submission.status = isAccepted ? 'Accepted' : 'Rejected';

  // Store the submission in the SUBMISSIONS array
  SUBMISSIONS.push(submission);

  // Return a success response
  return res.status(200).send('Submission created successfully');
});

// Admin-only route to add a new problem
app.post('/admin/add-problem', function(req, res) {
  
  const isAdmin = true; 
  if (!isAdmin) {
    return res.status(403).send('Access denied');
  }

  const newProblem = req.body;

  // Add the new problem to the QUESTIONS array
  QUESTIONS.push(newProblem);

  // Return a success response
  return res.status(200).send('Problem added successfully');
});

app.listen(port, function() {
  console.log(`Example app listening on port ${port}`);
});

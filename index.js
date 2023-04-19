const express = require('express')
const app = express()
const port = 3001

const USERS = [];

const QUESTIONS = [{    title: "Two states",    description: "Given an array, return the maximum of the array?",    testCases: [{        input: "[1,2,3,4,5]",        output: "5"    }]
}];

const SUBMISSIONS = []

// Route for user signup
app.post('/signup', function(req, res) {
  const { email, password } = req.body;
  
  // Check if the user with the given email already exists
  const userExists = USERS.some(user => user.email === email);
  if (userExists) {
    res.status(400).send('User with this email already exists.');
  } else {
    // Store the new user
    USERS.push({ email, password });

    // return back 200 status code to the client
    res.sendStatus(200);
  }
});

// Route for user login
app.post('/login', function(req, res) {
  const { email, password } = req.body;

  // Check if the user with the given email exists in the USERS array
  const user = USERS.find(user => user.email === email);
  if (user && user.password === password) {
    // Generate a random token for the user
    const token = Math.random().toString(36).substring(2);
    res.status(200).json({ token });
  } else {
    res.status(401).send('Invalid email or password');
  }
});

// Route to get all questions
app.get('/questions', function(req, res) {
  res.status(200).json(QUESTIONS);
});

// Route to get all submissions
app.get('/submissions', function(req, res) {
  res.status(200).json(SUBMISSIONS);
});

// Route for submitting a solution
app.post('/submissions', function(req, res) {
  const { problemId, solution } = req.body;
  const isAccepted = Math.random() < 0.5; // randomly accept or reject the solution
  const submission = { problemId, solution, isAccepted };
  SUBMISSIONS.push(submission);
  res.status(200).json(submission);
});

// Route for admins to add new questions
app.post('/questions', function(req, res) {
  const isAdmin = req.headers['authorization'] === 'admin'; // check if user is an admin
  if (isAdmin) {
    const { title, description, testCases } = req.body;
    const newQuestion = { title, description, testCases };
    QUESTIONS.push(newQuestion);
    res.status(200).send('Question added successfully');
  } else {
    res.status(401).send('Unauthorized');
  }
});

app.listen(port, function() {
  console.log(`Example app listening on port ${port}`)
})

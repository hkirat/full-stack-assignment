const express = require('express');
const app = express();
const port = 8080;

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

// A middleware function that will be used to authenticate users as admins
function isAdmin(req, res, next) {
  const token = req.headers.authorization;
  // You can implement a more secure authentication mechanism
  // For simplicity, we are checking if the token equals "admin"
  if (token === "admin") {
    next();
  } else {
    res.sendStatus(401);
  }
}

app.use(express.json());

app.post('/signup', function(req, res) {
  const { email, password } = req.body;
  
  // Check if the user with the given email already exists
  const userExists = USERS.some((user) => user.email === email);
  
  if (userExists) {
    res.sendStatus(409); // Conflict: User already exists
  } else {
    USERS.push({ email, password });
    res.sendStatus(200);
  }
});

app.post('/login', function(req, res) {
  const { email, password } = req.body;
  
  // Find the user with the given email
  const user = USERS.find((user) => user.email === email);
  
  if (user && user.password === password) {
    // Return a token if the user is authenticated
    res.json({ token: "random-token" });
  } else {
    res.sendStatus(401); // Unauthorized: Invalid email or password
  }
});

app.get('/questions', function(req, res) {
  res.json(QUESTIONS);
});

app.get('/submissions', function(req, res) {
  res.json(SUBMISSIONS);
});

app.post('/submissions', function(req, res) {
  const { solution, questionId } = req.body;
  const question = QUESTIONS.find((q) => q.id === questionId);
  
  // Randomly accept or reject the submission
  const isAccepted = Math.random() >= 0.5;
  
  const submission = {
    id: SUBMISSIONS.length + 1,
    solution,
    isAccepted,
    question
  };
  
  SUBMISSIONS.push(submission);
  
  res.json(submission);
});

app.post('/problems', isAdmin, function(req, res) {
  const { title, description, testCases } = req.body;
  const problem = {
    id: QUESTIONS.length + 1,
    title,
    description,
    testCases
  };
  QUESTIONS.push(problem);
  res.sendStatus(200);
});

app.listen(port, function() {
  console.log(`Example app listening on port ${port}`);
});
